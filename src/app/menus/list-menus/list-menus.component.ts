import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-menus',
  templateUrl: './list-menus.component.html',
  styleUrls: ['./list-menus.component.css']
})
export class ListMenusComponent implements OnInit {


  @Output() selectItem = new EventEmitter<object>();


  private _menuData = null;
  selectedIdx = null;

  @Input('data')
  set data(data: any) {
    this._menuData = data;
  }

  get data(): any {
    return this._menuData;
  }

  constructor() { }


  onItemSelect(item, idx) {
    this.selectedIdx = idx;
    this.selectItem.emit(item);
  }

  ngOnInit() {



  }
}
