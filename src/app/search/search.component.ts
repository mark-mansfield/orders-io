import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  constructor() {}
  @Output() searchTerm = new EventEmitter<object>();

  onSearchClicked(item) {
    this.searchTerm.emit(item);
  }

  ngOnInit() {}
}
