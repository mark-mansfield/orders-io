import { Injectable } from '@angular/core';
import { SnackBarService } from "./snackbar.service";
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + 'orders/';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public ordersUpdated = new Subject<Order[]>();
  public ordersLoaded = new Subject<Order[]>();
  public orderDeleted = new Subject<Order[]>();
  public orderCreated = new Subject<Order[]>();
  public ordersFiltered = new Subject<Order[]>();
  public errorsRecieved = new Subject<String>();

  orders = [];
  constructor(private http: HttpClient, public snackBarService: SnackBarService) { }

  getOrdersFilteredListener() {
    return this.ordersFiltered.asObservable();
  }

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

  getErrorsListener() {
    return this.errorsRecieved.asObservable();
  }

  formatDate(dateObj) {
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    // console.log(date + '/' + month + '/' + year);
    return date + '/' + month + '/' + year;
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
  addDishes(dishes) {
    console.log(dishes);
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

  filterByEventType(eventType) {
    console.log('************** ORDER SERVICE *******************');
    console.log('filterByEventType recieved  event : ');
    console.log(eventType);
    console.log('********************************************');

    if (eventType === 'all') {
      this.ordersLoaded.next([...this.orders]);
      return;
    }

    const filteredList = this.orders.filter(item => {
      return item.eventDetails.eventType === eventType;
    });

    // console.log(filteredList);
    if (filteredList.length > 0) {
      this.ordersFiltered.next([...filteredList]);
    } else {
      this.errorsRecieved.next('search term not found');
    }
  }

  filterByName(name) {
    const filteredList = this.orders.filter(item => {
      return item.customerDetails.contactName.includes(name);
    });
    // console.log(filteredList.length);
    if (filteredList.length > 0) {
      this.ordersFiltered.next([...filteredList]);
    } else {
      this.errorsRecieved.next('search term not found');
    }
  }

  destructureEventDate(obj) {
    const str = obj.date + ' / ' + obj.month + ' / ' + obj.year;
    return str;
  }

  filterOrdersByPickUpDayAndTimev2(date) {
    const filteredList = this.orders.filter(item => {
      return item.eventDetails.eventDate === date;
    });
    console.log(filteredList);
    if (filteredList.length > 0) {
      this.ordersFiltered.next([...filteredList]);
      return;
    }


  }

  // @param: pickUpDate is of type object and represents a pickUpDate
  // @return: returns an array of orders sorted by pickup date ascending according to the pickUpDate
  filterOrdersByPickUpDayAndTime(pickUpDate) {
    console.log('starting list to filter');
    console.log(this.orders);
    const filteredList = this.orders.filter(
      item => this.destructureEventDate(item.eventDetails.eventDate) === pickUpDate
    );
    console.log('filtered list l');
    console.log(filteredList);
    // we don't need filter by time if there is only one element in the list
    if (filteredList.length > 1) {
      // filteredList.sort((a, b) => (a.pickUpTimeSelected - b.pickUpTimeSelected ? 1 : -1));

      this.ordersFiltered.next([...filteredList]);
    } else {
      this.ordersFiltered.next([...filteredList]);
    }
  }

  // clean values / convert to number: remove ':' and 'pm' parts '4:15' = 415
  // cleanTimeStr(str) {
  //   const arr = str.split('');
  //   let string = '';
  //   arr.forEach(item => {
  //     if (item !== '.' || item !== 'p' || item !== 'm') {
  //       string += item;
  //     }
  //   });
  //   console.log(str);
  //   return string;
  // }

  createTimeStr(str) {
    let arr = str.split('');
    arr.splice(1, 0, '.');
    arr.push('p');
    arr.push('m');

    return arr.join('');
  }

  // @param: obj represents an order or collection of orders
  // @return: returns a csv string of all orders
  createCsvFromJson(obj) {
    console.log(obj.length);

    let colNames = Object.keys(obj[0].customerDetails);
    colNames = colNames.concat(Object.keys(obj[0].orderedItems));
    colNames.push('\r\n');
    let csvData = colNames.join(',');
    Object.entries(obj).forEach((item, index) => {
      let rowData = Object.values(obj[index].customerDetails);
      rowData = rowData.concat(Object.values(obj[index].orderedItems));
      rowData.push('\r\n');
      csvData = csvData.concat(rowData.join(','));
    });

    console.log(csvData);
    return csvData;
  }
}
