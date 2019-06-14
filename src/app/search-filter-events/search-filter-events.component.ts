import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-filter-events',
  templateUrl: './search-filter-events.component.html',
  styleUrls: ['./search-filter-events.component.css']
})
export class SearchFilterEventsComponent implements OnInit {
  private _eventTypes = '';
  @Output() selectItem = new EventEmitter<object>();
  @Input('eventTypes')
  set uniqueId(eventTypes: any) {
    this._eventTypes = eventTypes;
  }

  get eventTypes(): any {
    return this._eventTypes;
  }

  onEventSelected(item) {
    this.selectItem.emit(item);
  }
  constructor() {}

  ngOnInit() {
    console.log(this.eventTypes);
  }
}
