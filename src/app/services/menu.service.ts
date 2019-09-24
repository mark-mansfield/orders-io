import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../models/menu.model';
import { SnackBarService } from './snackbar.service';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + 'menus/';

@Injectable({ providedIn: 'root' })
export class DataService {
  private menus: Menu[] = [];
  private selectedMenu: Menu[];
  private menuMetaDataUpdated = new Subject<Menu[]>();
  private menusFiltered = new Subject<Menu[]>();
  private searchResultsCleared = new Subject<Menu[]>();
  private dishesAdded = new Subject<Menu[]>();
  private dishesDeleted = new Subject();
  private menuDeleted = new Subject();

  constructor(private http: HttpClient, private snackBarService: SnackBarService) { }

  getMenuMetaDataUpdatedListener() {
    return this.menuMetaDataUpdated.asObservable();
  }

  getMenuDeletedListener() {
    return this.menuDeleted.asObservable();
  }

  getMenusFilteredListener() {
    return this.menusFiltered.asObservable();
  }

  getDishesDeletedListener() {
    return this.dishesDeleted.asObservable();
  }

  getDishesAddedListener() {
    return this.dishesAdded.asObservable();
  }

  getSearchResultsClearedListener() {
    return this.searchResultsCleared.asObservable();
  }

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
        this.menuMetaDataUpdated.next([...this.menus]);
      });
  }

  getMenu(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
    }>(BACKEND_URL + id);
  }

  filterByName(name) {
    const filteredData = [...this.menus].filter(function (item) {
      return item.title.includes(name.toLowerCase());
    });
    this.menusFiltered.next([...filteredData]);
  }

  clearSearchResults() {
    this.menuMetaDataUpdated.next([...this.menus]);
  }

  ondDishesAdded(dishes) {
    console.log(dishes.length);
    this.dishesAdded.next([...dishes]); // inform UI
  }

  addMenu(menu) {
    // console.log(menu);

    this.http.post<{ message: string; menu: any }>(BACKEND_URL + 'create', menu).subscribe(returnedData => {
      console.log(returnedData.message);
      if (returnedData.message === '0') {
        this.menus.push(returnedData.menu);
        this.menuMetaDataUpdated.next([...this.menus]); // inform UI
        this.snackBarService.openSnackBar('Menu Added!');
      } else if (returnedData.message === '1') {
        this.snackBarService.openSnackBar('You are not authorized to perform this action');
      } else {
        this.snackBarService.openSnackBar(returnedData);
      }
    });
  }

  updateMenu(menu) {
    console.log(menu);
    console.log(this.menus);
    this.http.put<{ message: string; menu: any }>(BACKEND_URL + 'update', menu).subscribe(returnedData => {
      console.log(returnedData.message);
      if (returnedData.message) {
        const idx = this.menus.findIndex(p => p._id === menu._id);
        this.menus[idx] = menu;
        this.menuMetaDataUpdated.next([...this.menus]); // inform UI
        this.snackBarService.openSnackBar('Menu updated');
      } else {
        this.snackBarService.openSnackBar('Menu not deleted due to server error; retry');
      }
    });
  }

  deleteDishFromMenu(menuIdx, dishName) {
    this.selectedMenu = this.menus.filter(menu => menu._id === menuIdx);
    const tmpArr = this.selectedMenu[0].items;
    const filteredArr = tmpArr.filter(item => item.name !== dishName);
    this.selectedMenu[0].items = filteredArr;
    this.dishesDeleted.next([...filteredArr]); // inform UI
  }

  deleteMenu(id: String) {

    this.http.delete<{ message: any }>(BACKEND_URL + id).subscribe(returnedData => {
      console.log(returnedData.message === '0');

      if (returnedData.message === '0') {
        const updateMenus = this.menus.filter(menu => menu._id !== id);
        this.menus = updateMenus;
        this.menuMetaDataUpdated.next([...this.menus]); // inform UI
        this.menuDeleted.next(); // inform UI
        this.snackBarService.openSnackBar('Menu Deleted!');
      } else if (returnedData.message === '1') {
        this.snackBarService.openSnackBar('You are not authorized to perform this action');
      } else {
        this.snackBarService.openSnackBar(returnedData.message);
      }
    });
  }
}
