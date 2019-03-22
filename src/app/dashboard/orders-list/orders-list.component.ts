import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImportService } from '../import.service';
import { OrdersService } from '../orders.service';
import { Order } from '../models/order.model';
import {
  MatDialog,
  MatDialogConfig,
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material';
import { DialogsComponent } from '../../dialogs/dialogs.component';
import { FiltersDialogComponent } from '../../dialogs/filters-dialog/filters-dialog.component';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
  importSub: Subscription;
  orderCreatedSub: Subscription;
  ordersUpdatedSub: Subscription;
  ordersLoaded: Subscription;
  ordersDeleted: Subscription;
  orders = [];
  order = {
    menuName: '',
    customerDetails: {},
    orderedItems: {},
    __v: 0
  };

  showFilters = false;
  filterDates = ['Tuesday 18th Sep', 'Wednesday 19th Sep'];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  extraClasses = ['dark-snackbar'];
  constructor(
    public importService: ImportService,
    public orderService: OrdersService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  openSnackBar(message) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 3000;
    config.panelClass = this.extraClasses;
    this.snackBar.open(message, '', config);
  }

  ngOnInit() {
    // load orders from db
    this.orderService.getOrders({ mode: 'list' });
    this.ordersLoaded = this.orderService.getOrdersLoadedListener().subscribe(returnedData => {
      this.orders = returnedData;
    });

    // listen for deleted orders
    this.ordersDeleted = this.orderService.getOrderDeletedListener().subscribe(returnedData => {
      this.openSnackBar('order deleted');
      this.orders = returnedData;
    });

    // listen for orders Updates
    this.ordersUpdatedSub = this.orderService.getOrdersUpdatedListener().subscribe(returnedData => {
      console.log('loading orders after update');
      this.openSnackBar('order updated');
      this.orders = returnedData;
    });

    // listen for order imports
    this.importSub = this.importService.getOrderImportListener().subscribe(arr => {
      this.orderService.createOrder(this.transformOrder(arr[0], arr[1]));
    });

    // listen for created orders
    this.orderCreatedSub = this.orderService.getOrderCreatedListener().subscribe(returnData => {
      this.openSnackBar('order created');
      console.log(returnData);
      this.orders.unshift(returnData);
    });
  }

  OnDestroy() {
    this.ordersUpdatedSub.unsubscribe();
    this.importSub.unsubscribe();
    this.orderCreatedSub.unsubscribe();
  }

  transformOrder(order, menuName) {
    // data comes in as json Array
    const jsonObj = JSON.parse(JSON.stringify(order));
    const customerInfo = {};
    const items = {};

    Object.entries(jsonObj).forEach(([key, value]) => {
      // perform some transforms on key names and omit the total
      if (key === 'Order #') {
        key = 'orderNum';
      }
      if (this.orderService.hasWhiteSpace(key)) {
        key = key.split(' ').join('_');
      }
      if (value === '') {
        value = '0';
      }
      // omit the total
      if (key === '$') {
        key = 'Cost';
      }

      if (
        key !== 'orderNum' &&
        key !== 'contactName' &&
        key !== 'contactNumber' &&
        key !== 'pickUpDay' &&
        key !== 'pickUpTime' &&
        key !== 'Cost'
      ) {
        items[key] = value;
      } else {
        customerInfo[key] = value;
      }
    });
    this.order.menuName = menuName;
    this.order.customerDetails = customerInfo;
    this.order.orderedItems = items;
    console.log(this.order);
    return this.order;
  }

  showFiltersDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height = '25%';
    dialogConfig.width = '20%';
    dialogConfig.data = this.filterDates;

    const dialogRef = this.dialog.open(FiltersDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(dialogReturnData => {
      if (dialogReturnData !== null) {
        this.orderService.filterOrdersByPickupDay(dialogReturnData);
        // this.orders = this.orders.filter(item => {
        //   return item.customerDetails.pickUpDay === dialogReturnData;
        // });
        // console.log(` date selected : ${dialogReturnData}`);
      }
    });
  }
  // open dialog
  showOrdersDialog(idx) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height = '95%';
    dialogConfig.width = '95%';
    dialogConfig.data = this.orders[idx];

    const dialogRef = this.dialog.open(DialogsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(dialogReturnData => {
      if (dialogReturnData !== null) {
        this.orderService.updateSingleOrder(dialogReturnData);
      }
    });
  }

  deleteOrder(_id) {
    this.orderService.deleteOrder(_id);
  }
}
