import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  viewOrders = true;
  viewOrderCreate = false;
  constructor() {}

  _createOrder() {
    this.viewOrderCreate = true;
  }

  _viewOrders() {
    this.viewOrders = true;
  }

  _toggleViews() {
    this.viewOrders = !this.viewOrders;
    this.viewOrderCreate = !this.viewOrderCreate;
  }

  _navgationBackDetected($event) {
    this._toggleViews();
  }
  ngOnInit() {}
}
