import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-orders-filter',
  templateUrl: './orders-filter.component.html',
  styleUrls: ['./orders-filter.component.css']
})
export class OrdersFilterComponent implements OnInit {
  @Input('filterDates') filterDates: any;

  constructor() {}

  ngOnInit() {
    console.log(this.filterDates);
  }
}
