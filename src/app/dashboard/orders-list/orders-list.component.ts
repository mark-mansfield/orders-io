import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



import { ImportService } from '../../services/import.service';
import { OrderService } from '../../services/order.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackBarService } from '../../services/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogsComponent } from '../../dialogs/dialogs.component';




@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit, OnDestroy {


  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

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
  filterDates = [];
  filterTimes = ['4:00pm', '3:30pm', '4:15pm', '5:00pm'];
  filter = null;

  eventTypeSelected = false;

  date = null;


  @Input() data: any;

  @Output() selectItem = new EventEmitter<object>();

  selectedIdx = null;
  onItemSelect(item, idx) {
    this.selectedIdx = idx;
    this.selectItem.emit(item);
  }

  // orderImportSub: Subscription;
  // orderCreatedSub: Subscription;
  // ordersUpdatedSub: Subscription;
  // ordersLoadedSub: Subscription;
  // ordersDeletedSub: Subscription;
  // ordersFilteredSub: Subscription;
  // errorsSub: Subscription;


  constructor(
    private breakpointObserver: BreakpointObserver,
    public importService: ImportService,
    public orderService: OrderService,
    public dialog: MatDialog,
    private snackBarService: SnackBarService,
    private sanitizer: DomSanitizer
  ) { }

  // openSnackBar(message) {
  //   const config = new MatSnackBarConfig();
  //   config.verticalPosition = this.verticalPosition;
  //   config.horizontalPosition = this.horizontalPosition;
  //   config.duration = 3000;
  //   config.panelClass = this.extraClasses;
  //   this.snackBar.open(message, '', config);
  // }

  ngOnInit() { }


  returnFormattedDate() {
    return 'xyz'
  }
  getFormattedDate(item) {
    console.log(item);
    const arr = item.split('-');
    this.date = arr[2].slice(0, 2) + ' / ' + arr[1] + ' / ' + arr[0];
    return this.date;
    // this.date = this.orderService.formatDate(item);
  }

  ngOnDestroy() {
    // this.ordersUpdatedSub.unsubscribe();
    // this.orderImportSub.unsubscribe();
    // this.orderCreatedSub.unsubscribe();
    // this.ordersDeletedSub.unsubscribe();
    // this.ordersFilteredSub.unsubscribe();
    // this.ordersLoadedSub.unsubscribe();
    // this.errorsSub.unsubscribe();
  }

  // transformOrder(order, menuName) {
  //   // data comes in as json Array
  //   const jsonObj = JSON.parse(JSON.stringify(order));
  //   const customerInfo = {};
  //   const items = {};

  //   Object.entries(jsonObj).forEach(([key, value]) => {
  //     // perform some transforms on key names and omit the total
  //     if (key === 'Order #') {
  //       key = 'orderNum';
  //     }
  //     if (this.orderService.hasWhiteSpace(key)) {
  //       key = key.split(' ').join('_');
  //     }
  //     if (value === '') {
  //       value = '0';
  //     }
  //     // omit the total
  //     if (key === '$') {
  //       key = 'Cost';
  //     }

  //     if (
  //       key !== 'orderNum' &&
  //       key !== 'contactName' &&
  //       key !== 'contactNumber' &&
  //       key !== 'pickUpDay' &&
  //       key !== 'pickUpTime' &&
  //       key !== 'Cost'
  //     ) {
  //       items[key] = value;
  //     } else {
  //       customerInfo[key] = value;
  //     }
  //   });
  //   this.order.menuName = menuName;
  //   this.order.customerDetails = customerInfo;
  //   this.order.orderedItems = items;
  //   console.log(this.order);
  //   return this.order;
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
    console.log(dialogConfig.data);
    // const dialogRef = this.dialog.open(DialogsComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(dialogReturnData => {
    //   if (dialogReturnData !== null) {
    //     this.orderService.updateSingleOrder(dialogReturnData);
    //   }
    // });
  }

  showOrder(idx) {
    console.log(this.orders[idx]);
  }

  deleteOrder(_id) {
    this.orderService.deleteOrder(_id);
  }

  updateFilterSelected(filter) {
    // console.log('************** ORDER - LIST COMPONENT *******************');
    // console.log('filterByEventType recieved  event : ');
    // console.log(filter);
    // console.log('********************************************');

    this.filterIsSelected = true;
    this.filter = filter;
    this.orderService.filterOrdersByPickUpDayAndTime(filter);
  }

  resetFilterSelected() {
    this.filter = null;
    this.filterIsSelected = false;
    this.createRunSheet = false;
    // this.orderService.getOrders({ mode: 'list' });
  }

  filterByName(name) {
    this.orderService.filterByName(name);
  }

  buildRunSheetClicked(orders) {
    this.buildingRunsheet = true;
    setTimeout(() => {
      this.fileName = 'runsheet-' + orders[0].customerDetails.pickUpDay + '.csv';
      const blob = new Blob([this.orderService.createCsvFromJson(orders)], { type: 'application/octet-stream' });
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      this.buildingRunsheet = false;
    }, 5000);
  }
}
