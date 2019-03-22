import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.css']
})
export class FiltersDialogComponent implements OnInit {
  filters: any;
  filterSelected = false;
  filterChosen: any;
  constructor(public dialogRef: MatDialogRef<FiltersDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    console.log(this.data);
    this.filters = this.data;
  }

  updateFilterSelected(filter) {
    this.filterSelected = true;
    this.filterChosen = filter;
    console.log(this.filterChosen);
  }

  setFilterAndClose() {
    this.dialogRef.close(this.filterChosen);
  }
}
