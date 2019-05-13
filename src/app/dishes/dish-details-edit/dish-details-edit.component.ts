import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dish-details-edit',
  templateUrl: './dish-details-edit.component.html',
  styleUrls: ['./dish-details-edit.component.css']
})
export class DishDetailsEditComponent implements OnInit {
  itemData = null;
  @Input() courses: any;

  @Input() set data(data: any) {
    this.itemData = data;
  }

  get data(): any {
    return this.itemData;
  }

  @Input() editMode: Boolean;
  @Output() cancelEdit = new EventEmitter<boolean>();
  @Output() update = new EventEmitter<Object>();

  constructor() {}

  cancel() {
    console.log('cancel clicked');
    this.cancelEdit.emit(true);
  }

  save(obj) {
    console.log('save clicked');
    this.update.emit(obj);
  }

  ngOnInit() {
    this.itemData = { ...this.data };
    console.log(this.itemData);
  }
}
