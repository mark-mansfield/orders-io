import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-menus',
  templateUrl: './list-menus.component.html',
  styleUrls: ['./list-menus.component.css']
})
export class ListMenusComponent implements OnInit {
  @Input() data: any;
  @Output() selectItem = new EventEmitter<object>();
  constructor() { }

  selectedIdx = null;
  onItemSelect(item, idx) {
    this.selectedIdx = idx;
    this.selectItem.emit(item);
  }

  ngOnInit() { }
}
