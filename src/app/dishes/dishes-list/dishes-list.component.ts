import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.css']
})
export class DishesListComponent implements OnInit {
  @Input() data: any;
  @Output() selectItem = new EventEmitter<object>();
  constructor() {}
  selectedIdx = null;
  onItemSelect(item, idx) {
    this.selectedIdx = idx;
    this.selectItem.emit(item);
  }

  ngOnInit() {
    console.log(this.data);
  }
}
