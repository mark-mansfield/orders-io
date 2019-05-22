import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../models/menu.model';
import { SnackBarService } from './snackbar.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + 'menus/';

@Injectable({ providedIn: 'root' })
export class DataService {
  private menus: Menu[] = [];
  private menusUpdated = new Subject<Menu[]>();

  constructor(private http: HttpClient, private router: Router, private snackBarService: SnackBarService) {}

  getMenus() {
    return this.http
      .get<{ id: string; message: string; menus: any }>(BACKEND_URL)
      .pipe(
        map(menuData => {
          // transform object back into a new object
          return menuData.menus.map(menu => {
            // server creates _id:, we want to use id: like our model suggests.
            return {
              title: menu.title,
              description: menu.description,
              items: menu.items,
              _id: menu._id
            };
          });
        })
      )
      .subscribe(transformedMenuData => {
        this.menus = transformedMenuData;
        this.menusUpdated.next([...this.menus]);
      });
  }

  getMenuUpdateListener() {
    return this.menusUpdated.asObservable();
  }

  getMenu(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
    }>(BACKEND_URL + id);
  }

  addMenu(menu) {
    // console.log(menu);
    this.http.post<{ message: string; menu: any }>(BACKEND_URL + 'create', menu).subscribe(returnedData => {
      console.log(returnedData.menu);
      this.menus.push(returnedData.menu);
      this.menusUpdated.next([...this.menus]); // inform UI
    });
  }

  updateMenu(menu) {
    console.log(menu);
    this.http.put<{ message: string; menu: any }>(BACKEND_URL + 'update', menu).subscribe(returnedData => {
      console.log(returnedData.message);
      if (returnedData.message) {
        const idx = this.menus.findIndex(p => p._id === menu._id);
        this.menus[idx] = menu;
        this.menusUpdated.next([...this.menus]); // inform UI
        this.snackBarService.openSnackBar('order updated');
      } else {
        console.log('menu not updated...');
      }
    });
  }

  deleteMenu(id: String) {
    this.http.delete(BACKEND_URL + id).subscribe(result => {
      // filter returns all entries where the  condition === true and removes entries where the condition === false
      const updateMenus = this.menus.filter(menu => menu._id !== id);
      // update menus array with filtered result
      this.menus = updateMenus;
      // inform UI
      this.menusUpdated.next([...this.menus]);
      console.log(result);
    });
  }
}
