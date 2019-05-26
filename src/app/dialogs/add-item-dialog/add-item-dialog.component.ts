import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css']
})
export class AddItemDialogComponent implements OnInit {
  arr: any = [];
  injectedData: any = [];
  exisitngSelections: any = [];
  checkBoxArr: any = [];
  courses: any = [];

  sumbitDisabled: Boolean = true;
  allSelected: Boolean = false;
  searchResults: Boolean = false;

  public itemsFiltered = new Subject();
  public listReset = new Subject();

  filteredItemsSub: Subscription;
  resetListSub: Subscription;

  searchInputValue = '';
  getResetListListener() {
    return this.listReset.asObservable();
  }

  getItemsFilteredListener() {
    return this.itemsFiltered.asObservable();
  }

  constructor(
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit() {
    this.injectedData = this.data[0];
    this.exisitngSelections = this.data[1];

    // init data
    this.injectedData.forEach((item, idx) => {
      const tmpObj = {
        id: idx,
        name: item.name,
        checked: false
      };
      this.checkBoxArr.push(tmpObj);
    });

    //  all selected
    if (this.exisitngSelections.length === this.injectedData.length) {
      this.allSelected = true;
    }

    // check any pre exisitng items
    this.exisitngSelections.forEach(item => {
      const idx = this.injectedData.findIndex(p => p.name === item.name);
      this.checkBoxArr[idx].checked = !this.checkBoxArr[idx].checked;
    });

    // listen for filtered orders
    this.filteredItemsSub = this.getItemsFilteredListener().subscribe(filteredData => {
      this.injectedData = filteredData;
    });

    // listen for reset list
    this.resetListSub = this.getResetListListener().subscribe(initialData => {
      // console.log(initialData);
      this.injectedData = initialData;
    });

    // setup courses
    this.injectedData.forEach((item, index) => {
      if (this.courses[index] !== item.course) {
        this.courses.push(item.course);
      }
    });
    this.courses.unshift('all');
    this.courses = new Set(this.courses);
    console.log(this.courses);
  }

  resetList() {
    this.listReset.next([...this.data[0]]);
    this.searchResults = false;
    this.searchInputValue = '';
    // console.log(this.checkBoxArr);
  }

  filterByName(name) {
    const filteredList = [];
    this.checkBoxArr.forEach((item, index) => {
      if (item.name.toLowerCase().includes(name.toLowerCase())) {
        filteredList.push(this.checkBoxArr[index]);
      }
      this.searchResults ? console.log('search result present') : (this.searchResults = true);
    });
    this.itemsFiltered.next([...filteredList]);
  }

  onFilterByCourse(course) {
    if (course === 'all') {
      this.injectedData = this.data[0];
      return;
    }
    this.injectedData = [...this.data[0]].filter(function(item) {
      return item.course === course;
    });
    this.searchResults = true;
  }

  getCheckboxChecked(name) {
    const idx = this.checkBoxArr.findIndex(p => p.name === name);
    return this.checkBoxArr[idx].checked;
  }

  updateCheckboxChecked(name) {
    this.checkBoxArr.forEach((item, idx) => {
      if (item.name === name) {
        this.checkBoxArr[idx].checked = !this.checkBoxArr[idx].checked;
      }
    });
  }

  toggleAllCheckBoxesChecked() {
    if (this.allSelected) {
      this.checkBoxArr.forEach(item => {
        item.checked = false;
      });
      this.allSelected = false;
      this.arr = [];
      // console.log(this.checkBoxArr);
      return;
    }

    this.checkBoxArr.forEach(item => {
      item.checked = true;
    });
    // console.log(this.checkBoxArr);
    this.arr = [...this.injectedData];
    this.allSelected = true;
  }

  onFinishClicked() {
    this.arr = [];
    this.checkBoxArr.forEach((item, index) => {
      if (item.checked) {
        this.arr.push(this.injectedData[index]);
      }
    });
    this.dialogRef.close(this.arr);
  }
}
