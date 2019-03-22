import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Import } from './models/order.model';
import { Order } from './models/order.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + 'orders/';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  public ordersUpdated = new Subject<Order[]>();
  public ordersLoaded = new Subject<Order[]>();
  public orderDeleted = new Subject<Order[]>();
  public orderCreated = new Subject<Order[]>();

  orders = [];
  constructor(private http: HttpClient) {}

  getOrderCreatedListener() {
    return this.orderCreated.asObservable();
  }

  getOrdersUpdatedListener() {
    return this.ordersUpdated.asObservable();
  }

  getOrderDeletedListener() {
    return this.orderDeleted.asObservable();
  }

  getOrdersLoadedListener() {
    return this.ordersLoaded.asObservable();
  }

  updateSingleOrder(order) {
    this.http.put<{ message: string; responseCode: number }>(BACKEND_URL + 'update', order).subscribe(returnedData => {
      console.log(returnedData.message, returnedData.responseCode);
      if (returnedData.responseCode === 200) {
        this.getOrders({ mode: 'update' });
      }
    });
  }

  getOrders(mode) {
    this.http.get<{ message: string; orders: any }>(BACKEND_URL + 'list').subscribe(returnedData => {
      // console.log(`Receiving ${returnedData.orders.length} documents`);
      if (mode.mode === 'delete') {
        this.ordersUpdated.next([...returnedData.orders]);
      }
      if (mode.mode === 'update') {
        this.ordersUpdated.next([...returnedData.orders]);
      }
      if (mode.mode === 'list') {
        this.orders = returnedData.orders;
        this.ordersLoaded.next([...this.orders]);
      }
      if (mode.mode === 'delete') {
        this.orderDeleted.next([...returnedData.orders]);
      }
    });
  }

  deleteOrder(id) {
    console.log(id);
    this.http.delete<{ responseCode: string }>(BACKEND_URL + id).subscribe(returnedData => {
      console.log(returnedData);
      if (returnedData.responseCode === '200') {
        console.log('order deleted');
        this.getOrders({ mode: 'delete' });
      }
    });
  }

  createOrder(order) {
    console.log(order);
    this.http.post<{ message: string; order: any }>(BACKEND_URL + 'create', order).subscribe(returnedData => {
      console.log(returnedData.order);
      this.orderCreated.next({ ...returnedData.order });
    });
  }

  hasWhiteSpace(str) {
    if (str.includes(' ')) {
      return true;
    } else {
      return false;
    }
  }

  // so the dialog can iterate over data
  // @param: obj contains all the object keys
  // @return: returns array of keys to be used as references, un-camelCased like ["contact name", "order num"]
  returnObjKeys(obj) {
    const transformedArr = [];
    const arrOfKeys = Object.keys(obj);
    arrOfKeys.forEach(item => {
      const itemStr = this.unCamelCaseValue(item);
      if (itemStr.includes('_')) {
        transformedArr.push(itemStr.split('_').join(' '));
      } else {
        transformedArr.push(itemStr);
      }
    });
    return transformedArr;
  }

  // so the dialog can iterate over data
  // @param: constains an object of keys and values
  // @return: returns array of object values
  returnObjValues(obj) {
    const arrOfVals = Object.values(obj);
    return arrOfVals;
  }

  // @param str is a string with white space that needs to be camelCased like "contact name"
  // @return : returns a string
  camelCaseValue(str) {
    const arr = str.split('');
    let camelCasedWords = arr[0].toLowerCase();

    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1] === ' ') {
        const char = arr[i].toUpperCase();
        camelCasedWords += char;
      } else {
        camelCasedWords += arr[i];
      }
    }
    return camelCasedWords.split(' ').join('');
  }

  // @param str is a string that is camelCased like "markMansfield"
  // @return: returns a string like "mark_mansfield"
  unCamelCaseValue(str) {
    let string = '';
    for (let i in str) {
      if (str[i].toUpperCase() === str[i]) {
        string += '_' + str[i].toLowerCase();
      } else {
        string += str[i];
      }
    }
    return string;
  }

  // @param: pickupday is of type string and represents a pickupDay
  // @return: returns an array of orders according to the pickupDay
  filterOrdersByPickupDay(pickupDay) {
    const filteredList = this.orders.filter(item => {
      return item.customerDetails.pickUpDay === pickupDay;
    });
    this.ordersLoaded.next([...filteredList]);
  }
}
