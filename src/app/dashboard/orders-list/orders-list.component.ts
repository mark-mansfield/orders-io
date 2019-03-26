import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImportService } from '../import.service';
import { OrdersService } from '../orders.service';
import { Order } from '../models/order.model';
import { DomSanitizer } from '@angular/platform-browser';

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
  orderImportSub: Subscription;
  orderCreatedSub: Subscription;
  ordersUpdatedSub: Subscription;
  ordersLoadedSub: Subscription;
  ordersDeletedSub: Subscription;
  ordersFilteredSub: Subscription;
  fileUrl;
  fileName;
  orders = [];
  ordersFiltered = [];
  order = {
    menuName: '',
    customerDetails: {},
    orderedItems: {},
    __v: 0
  };
  isLoading = true;
  buildingRunsheet = false;
  createRunSheet = false;
  filterIsSelected = false;
  filterDates = ['Tuesday 18th Sep', 'Wednesday 19th Sep'];
  filterTimes = ['4:00pm', '3:30pm', '4:15pm', '5:00pm'];
  filter = null;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  extraClasses = ['dark-snackbar'];
  constructor(
    public importService: ImportService,
    public orderService: OrdersService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
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

    this.ordersLoadedSub = this.orderService.getOrdersLoadedListener().subscribe(returnedData => {
      this.isLoading = false;
      this.orders = returnedData;
    });

    // listen for deleted orders
    this.ordersDeletedSub = this.orderService.getOrderDeletedListener().subscribe(returnedData => {
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
    this.orderImportSub = this.importService.getOrderImportListener().subscribe(arr => {
      this.orderService.createOrder(this.transformOrder(arr[0], arr[1]));
    });

    // listen for created orders
    this.orderCreatedSub = this.orderService.getOrderCreatedListener().subscribe(returnData => {
      this.openSnackBar('order created');
      this.orders.unshift(returnData);
    });

    // listen for filtered orders
    this.ordersFilteredSub = this.orderService.getOrdersFilteredListener().subscribe(filteredData => {
      console.log(filteredData);
      this.orders = filteredData;
    });
  }

  OnDestroy() {
    this.ordersUpdatedSub.unsubscribe();
    this.orderImportSub.unsubscribe();
    this.orderCreatedSub.unsubscribe();
    this.ordersDeletedSub.unsubscribe();
    this.ordersFilteredSub.unsubscribe();
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

  // showFiltersDialog() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.height = '25%';
  //   dialogConfig.width = '20%';
  //   dialogConfig.data = this.filterDates;

  //   const dialogRef = this.dialog.open(FiltersDialogComponent, dialogConfig);

  //   dialogRef.afterClosed().subscribe(dialogReturnData => {
  //     if (dialogReturnData !== null) {
  //       this.orderService.filterOrdersByPickUpDayAndTime(dialogReturnData);
  //     }
  //   });
  // }

  launchStepper() {
    this.createRunSheet = true;
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

  updateFilterSelected(filter) {
    this.filterIsSelected = true;
    this.filter = filter;
    this.orderService.filterOrdersByPickUpDayAndTime(filter, this.filterTimes);
    // if (mode === 'runsheet') {
    //   this.orderService.filterOrdersByPickUpDayAndTime(filter, this.filterTimes);
    // }
    // if (mode === 'list') {
    //   this.orderService.filterOrdersByPickUpDay(filter);
    // } else {
    //   this.orderService.filterOrdersByPickUpDay(filter);
    // }
  }

  resetFilterSelected() {
    this.filter = null;
    this.filterIsSelected = false;
    this.createRunSheet = false;
    this.orderService.getOrders({ mode: 'list' });
  }

  buildRunSheetClicked(orders) {
    this.buildingRunsheet = true;
    setTimeout(() => {
      this.fileName = 'runsheet.csv';
      const blob = new Blob([this.orderService.createCsvFromJson(orders)], { type: 'application/octet-stream' });
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      this.buildingRunsheet = false;
    }, 5000);
  }
}
