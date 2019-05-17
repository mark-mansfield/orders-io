import { Injectable } from '@angular/core';
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
  constructor(private http: HttpClient) {}

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
    // this.http.post<{ message: string; order: any }>(BACKEND_URL + 'create', order).subscribe(returnedData => {
    //   console.log(returnedData.order);
    //   this.orderCreated.next({ ...returnedData.order });
    // });
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

  // orderByPickUpTimes()
  // @param: orderList []
  // @param: pickUptimes []

  // clean values / convert to number: remove ':' and 'pm' parts '4:15' = 415
  cleanTimeStr(str) {
    const arr = str.split('');
    let string = '';
    arr.forEach(item => {
      if (item !== ':' && item !== 'p' && item !== 'm') {
        string += item;
      }
    });
    return parseInt(string);
  }

  createTimeStr(str) {
    let arr = str.split('');
    arr.splice(1, 0, ':');
    arr.push('p');
    arr.push('m');

    return arr.join('');
  }

  // iterate  over ther orders array picktimes(n) times with a different filter for each iteration
  // push each iteration to a storage array
  // @return: returns a storage array  ordered ascending by pickupTime
  orderByPickUpTimes(orderList: any, pickUpTimes: any) {
    // dismantle values, '4:15pm'  = '415' ,  ['3:00pm','3:15pm','4:15pm','5:00pm'] = [300,315,415,500]
    // re-order low to high [415,300,500,315] = [300,315,415,500]
    // recreate values as strings '415' = '4:15pm'  [300,315,415,500] = ['3:00pm','3:15pm','4:15pm','5:00pm']

    const arr = [];
    const times = [];
    let filteredListByTime = [];
    let filteredList = [];
    pickUpTimes.forEach(item => {
      arr.push(this.cleanTimeStr(item));
    });

    const sortedArr = arr.sort((a, b) => {
      return a - b;
    });

    sortedArr.forEach(item => {
      times.push(this.createTimeStr(item.toString()));
    });

    times.forEach(element => {
      filteredListByTime = orderList.filter(item => {
        return item.customerDetails.pickUpTime === element;
      });
      filteredList = filteredList.concat(filteredListByTime);
    });
    return filteredList;
  }

  filterByName(name) {
    const filteredList = this.orders.filter(item => {
      return item.customerDetails.contactName.includes(name);
    });
    console.log(filteredList.length);
    if (filteredList.length > 0) {
      this.ordersFiltered.next([...filteredList]);
    } else {
      this.errorsRecieved.next('search term not found');
    }
  }
  // @param: pickupday is of type string and represents a pickupDay
  // @return: returns an array of orders according to the pickupDay
  // filterOrdersByPickUpDay(pickupDay) {
  //   const filteredList = this.orders.filter(item => {
  //     return item.customerDetails.pickUpDay === pickupDay;
  //   });
  //   this.ordersFiltered.next([...filteredList]);
  // }

  // @param: pickupday is of type string and represents a pickupDay
  // @return: returns an array of orders sorted by pickup time ascending accoring to the pickupDay
  filterOrdersByPickUpDayAndTime(pickupDay, pickUpTimes) {
    const filteredList = this.orders.filter(item => {
      return item.customerDetails.pickUpDay === pickupDay;
    });

    // we don't need filter by time if there is only one element in the list
    if (filteredList.length > 1) {
      const filteredByDayAndTime = this.orderByPickUpTimes(filteredList, pickUpTimes);
      this.ordersFiltered.next([...filteredByDayAndTime]);
    } else {
      this.ordersFiltered.next([...filteredList]);
    }
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
