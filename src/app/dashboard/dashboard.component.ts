import { Component, OnInit, OnDestroy } from '@angular/core';

import { environment } from '../../environments/environment';
import { OrderService } from '../services/order.service';
import { Subscription } from 'rxjs';
import { ImportService } from '../services/import.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackBarService } from '../services/snackbar.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  uniqueId: string;

  orders = [];
  filterDates = [];
  selectedItem = null;
  filter = null;
  formMode = null;
  selectedEventType = 'all';
  EVENT_TYPES = environment.eventOptions;
  eventType = 'all';

  eventTypeSelected = false;
  filterIsSelected = false;
  isLoading = false;

  noSearchResults = false;
  hasSearchResults = false;
  isSearching = false;
  searchVisible = false;
  listVisible = false;
  formVisible = false;
  importVisible = false;
  // viewOrders = true;
  // viewOrderCreate = false;

  // orderImportSub: Subscription;
  orderCreatedSub: Subscription;
  ordersUpdatedSub: Subscription;
  ordersLoadedSub: Subscription;
  ordersDeletedSub: Subscription;
  ordersFilteredSub: Subscription;
  errorsSub: Subscription;

  constructor(
    public importService: ImportService,
    public orderService: OrderService,
    private snackBarService: SnackBarService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.orderService.getOrders({ mode: 'list' });

    // Listen for all orders loaded from server
    this.ordersLoadedSub = this.orderService.getOrdersLoadedListener().subscribe(returnedData => {
      this.isLoading = false;
      this.orders = returnedData;
    });
    this.toggleViews('default');

    // listen for deleted orders
    this.ordersDeletedSub = this.orderService.getOrderDeletedListener().subscribe(returnedData => {
      this.snackBarService.openSnackBar('order deleted');
      this.orders = returnedData;
    });

    // listen for orders Updates
    this.ordersUpdatedSub = this.orderService.getOrdersUpdatedListener().subscribe(returnedData => {
      console.log('loading orders after update');
      this.snackBarService.openSnackBar('order updated');
      this.orders = returnedData;
    });

    // listen for created orders
    this.orderCreatedSub = this.orderService.getOrderCreatedListener().subscribe(returnData => {
      this.snackBarService.openSnackBar('order created');
      this.orders.unshift(returnData);
    });

    // listen for filtered orders
    this.ordersFilteredSub = this.orderService.getOrdersFilteredListener().subscribe(filteredData => {
      this.orders = filteredData;
      this.eventTypeSelected = true; // <--set evet type for the UI  to show different elements
      console.log('************** ORDER - LIST COMPONENT *******************');
      console.log('ordersFilteredSub recieved  Data : ');
      console.log(this.orders);
      console.log('********************************************');
      this.orders.sort(function(a, b) {
        var dateA = a.eventDetails.eventDate.date + a.eventDetails.eventDate.month + a.eventDetails.eventDate.year;
        var dateB = b.eventDetails.eventDate.date + b.eventDetails.eventDate.month + b.eventDetails.eventDate.year;
        return dateA - dateB;
      });

      // moment returns a date object, we need toget the values out
      this.orders.forEach(item => {
        let date =
          item.eventDetails.eventDate.date +
          ' / ' +
          item.eventDetails.eventDate.month +
          ' / ' +
          item.eventDetails.eventDate.year;
        this.filterDates.push(date);
      });
      // return unique dates
      this.filterDates = this.filterDates.filter((v, i) => this.filterDates.indexOf(v) === i);
    });

    // listen for errors
    this.errorsSub = this.orderService.getErrorsListener().subscribe(errorMsg => {
      this.snackBarService.openSnackBar(errorMsg);
    });

    // listen for order imports
    // this.orderImportSub = this.importService.getOrderImportListener().subscribe(arr => {
    //   this.orderService.createOrder(this.transformOrder(arr[0], arr[1]));
    // });
  }

  updateFilterSelected(filter) {
    this.filterIsSelected = true;
    this.filter = filter;
    this.orderService.filterOrdersByPickUpDayAndTime(filter);
  }

  onItemSelect(item) {
    this.selectedItem = item;
    this.toggleViews('view');
  }

  createOrderNumber() {
    this.uniqueId = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(this.uniqueId);
  }

  ngOnDestroy() {
    this.ordersUpdatedSub.unsubscribe();
    // this.orderImportSub.unsubscribe();
    this.orderCreatedSub.unsubscribe();
    this.ordersDeletedSub.unsubscribe();
    this.ordersFilteredSub.unsubscribe();
    this.ordersLoadedSub.unsubscribe();
    this.errorsSub.unsubscribe();
  }

  toggleViews(view) {
    console.log(view);
    switch (view) {
      case 'create':
        this.createOrderNumber();
        this.initSelectedItem();
        this.searchVisible = false;
        this.listVisible = false;
        this.importVisible = false;
        this.formVisible = true;
        this.formMode = 'create';

        break;
      case 'view':
        this.uniqueId = this.selectedItem.customerDetails.orderNum;
        this.searchVisible = false;
        this.listVisible = false;
        this.importVisible = false;
        this.formVisible = true;
        this.formMode = 'view';

        break;

      case 'search':
        this.searchVisible = true;
        this.listVisible = false;
        this.importVisible = false;
        this.formVisible = false;
        break;

      case 'import':
        this.searchVisible = false;
        this.listVisible = false;
        this.importVisible = true;
        this.formVisible = false;
        break;

      default:
        this.searchVisible = false;
        this.listVisible = true;
        this.importVisible = false;
        this.formVisible = false;
        break;
    }
  }

  initSelectedItem() {
    this.selectedItem = {
      _id: '',
      menuName: '',
      customerDetails: {},
      orderedItems: [],
      eventDetails: {},
      notes: ''
    };
    console.log(this.selectedItem);
  }

  onSelectEventType(item) {
    console.log('************** DASHBOARD COMPONENT *******************');
    console.log('filtering by event: ');
    console.log(item);
    console.log('********************************************');
    this.orderService.filterByEventType(item);
  }

  filterByName(name) {
    this.orderService.filterByName(name);
  }

  onNotifyClicked(event: boolean): void {
    console.log(event);
    this.toggleViews('default');
  }
}
