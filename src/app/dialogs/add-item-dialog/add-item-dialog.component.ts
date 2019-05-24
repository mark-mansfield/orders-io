import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { allSettled } from 'q';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css']
})
export class AddItemDialogComponent implements OnInit {
  arr: any = [];
  injectedData: any;
  checkBoxArr: any = [];
  sumbitDisabled: Boolean = true;
  allSelected: Boolean = false;
  exisitngSelections: any;
  constructor(
    public dialogRef: MatDialogRef<AddItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit() {
    this.injectedData = this.data[0];
    this.exisitngSelections = this.data[1];

    console.log(this.exisitngSelections);
    this.injectedData.forEach(item => {
      const tmpObj = {
        id: item.name,
        checked: false
      };
      this.checkBoxArr.push(tmpObj);
    });

    // check any pre exisitng items

    if (this.exisitngSelections.length === this.injectedData.length) {
      this.allSelected = true;
    }
    this.exisitngSelections.forEach(item => {
      const idx = this.injectedData.findIndex(p => p.name === item.name);
      this.updateCheckboxChecked(idx);
    });
  }

  updateCheckboxChecked(idx) {
    this.checkBoxArr[idx].checked = !this.checkBoxArr[idx].checked;
  }

  toggleCheckBoxChecked() {
    if (this.allSelected) {
      this.checkBoxArr.forEach(item => {
        item.checked = false;
      });
      this.allSelected = false;
      this.arr = [];
      return;
    }

    this.checkBoxArr.forEach(item => {
      item.checked = true;
    });

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
