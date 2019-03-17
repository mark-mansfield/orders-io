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
export class ImportService {
  public orderImport = new Subject<Import[]>();
  public orderCreated = new Subject<Order[]>();
  order: any;

  constructor(private http: HttpClient, private router: Router) {}

  getOrderImportListener() {
    return this.orderImport.asObservable();
  }

  getOrderCreatedListener() {
    return this.orderCreated.asObservable();
  }

  uploadFile(file: File, fileNameStr) {
    console.log(`Uplaoding file: ${file.name}`);
    const formData = new FormData();
    // params (label that maps to the backend storage label, the file of type file, and the filename)
    formData.append('file', file);
    this.http.post<{ message: string; data: any }>(BACKEND_URL + 'import', formData).subscribe(returnedData => {
      this.orderImport.next([...returnedData.data, fileNameStr]);
    });
  }

  createOrder(order) {
    this.http.post<{ message: string; order: any }>(BACKEND_URL + 'create', order).subscribe(returnedData => {
      console.log(returnedData.message);
      this.orderCreated.next({ ...order });
    });
  }
}
