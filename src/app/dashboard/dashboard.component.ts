import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  viewOrders = true;
  viewOrderCreate = false;
  uniqueId: string;

  constructor() {}

  _createOrderNumber() {
    this.uniqueId = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(this.uniqueId);
  }

  _viewOrders() {
    this.viewOrders = true;
  }

  _toggleViews() {
    this.viewOrders = !this.viewOrders;
    this.viewOrderCreate = !this.viewOrderCreate;
    if (this.viewOrderCreate) {
      this._createOrderNumber();
    }
  }

  _navgationBackDetected($event) {
    this._toggleViews();
  }
  ngOnInit() {}
}
