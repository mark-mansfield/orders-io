import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImportService } from '../import.service';
import { OrdersService } from '../orders.service';
import { Order } from '../models/order.model';
@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
  importSub: Subscription;
  orderCreatedSub: Subscription;
  ordersUpdatedSub: Subscription;

  transformedObject: { type: 'object' };
  orderItems: any[];
  orders = [];
  order: Order[];
  constructor(public importService: ImportService, public orderService: OrdersService) {}

  ngOnInit() {
    // load orders from db
    this.orderService.getOrders();
    // listen for orders Updated changes
    this.ordersUpdatedSub = this.orderService.getOrdersUpdatedListener().subscribe(returnedData => {
      this.orders = returnedData;
    });

    // listen for import changes
    this.importSub = this.importService.getOrderImportListener().subscribe(jsonArray => {
      this.orderItems = [];
      this.importService.createOrder(this.transformOrder(jsonArray));
    });
    // listen for orders Created changes
    this.orderCreatedSub = this.importService.getOrderCreatedListener().subscribe(returnData => {
      this.orders.unshift(returnData);
    });
  }

  ngOnDestroy() {
    this.ordersUpdatedSub.unsubscribe();
    this.importSub.unsubscribe();
    this.orderCreatedSub.unsubscribe();
  }

  transformOrder(jsonArray) {
    console.log(jsonArray);
    // data comes in as json Array
    const jsonObj = JSON.parse(JSON.stringify(jsonArray[0]));
    const customerInfo = {};
    const items = {};
    const order = {
      menuName: jsonArray[1],
      customerDetails: [],
      orderedItems: []
    };

    Object.entries(jsonObj).forEach(([key, value]) => {
      // perform some transforms on key names and omit the total
      if (key === 'Order #') {
        key = 'orderNum';
      }
      if (value === '') {
        value = '0';
      }
      // omit the total
      if (key === '$') {
      }

      if (
        key !== 'orderNum' &&
        key !== 'contactName' &&
        key !== 'contactNumber' &&
        key !== 'pickUpDay' &&
        key !== 'pickUpTime' &&
        key !== '$'
      ) {
        items[key] = value;
      } else {
        customerInfo[key] = value;
      }
    });
    order.customerDetails.push(customerInfo);
    order.orderedItems.push(items);
    return order;
  }

  // createOrder(order) {
  //   this.importService.createOrder(order);
  // }
  viewOrder(selectedOrder) {
    console.log(selectedOrder);
  }
}
