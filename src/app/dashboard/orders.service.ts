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

  constructor(private http: HttpClient) {}

  getOrdersUpdatedListener() {
    return this.ordersUpdated.asObservable();
  }

  getOrders() {
    this.http.get<{ id: string; message: string; orders: any }>(BACKEND_URL + 'list').subscribe(returnedData => {
      // console.log(`Receiving ${returnedData.orders.length} documents`);
      this.ordersUpdated.next([...returnedData.orders]);
    });
  }
}
