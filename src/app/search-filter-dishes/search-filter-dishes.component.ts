import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-filter-dishes',
  templateUrl: './search-filter-dishes.component.html',
  styleUrls: ['./search-filter-dishes.component.css']
})
export class SearchFilterDishesComponent implements OnInit {
  private _courses = '';
  @Output() selectItem = new EventEmitter<object>();
  @Input('courses')
  set uniqueId(courses: any) {
    this._courses = courses;
  }

  get courses(): any {
    return this._courses;
  }

  onCourseSelected(item) {
    this.selectItem.emit(item);
  }
  constructor() {}

  ngOnInit() {

  }
}
