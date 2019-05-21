import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menu } from '../models/menu.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + 'menus/';

@Injectable({ providedIn: 'root' })
export class DataService {
  private menus: Menu[] = [];
  private menusUpdated = new Subject<Menu[]>();

  constructor(private http: HttpClient, private router: Router) {}

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
              id: menu._id
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
      console.log(returnedData.message);
      this.menus.push(menu);
      this.menusUpdated.next([...this.menus]); // inform UI
    });

    // this.http.post<{ message: string; menu: Menu }>(BACKEND_URL, menuData).subscribe(returnedData => {
    //   const menu: Menu = {
    //     id: returnedData.menu.id,
    //     title: title,
    //     description: description,
    //     items: items
    //   };
    //   console.log(returnedData.message);
    //   this.menus.push(menu);
    //   this.menusUpdated.next([...this.menus]); // inform UI
    //   this.router.navigate(['/list-menus']);
    // });
  }

  updateMenu(id: string, title: string, description: string, items: any) {
    let menuData: Menu | FormData;

    menuData = {
      id: id,
      title: title,
      description: description,
      items: {
        entree: ['chopped liver', 'confit tuna', 'hommus', 'romanian eggplant'],
        main: [
          'Slow Cooked Lamb Shoulder',
          'Grilled Ora king salmon',
          'Ocean trout tarator',
          'Slow Braised Free Range Chicken'
        ],
        soup: 'Holmbrae chicken and vegetable soup',
        desert: []
      }
    };

    // const menu: Menu = { id: id, title: title, description: description, imagePath: imagePath };
    this.http.put(BACKEND_URL + id, menuData).subscribe(response => {
      const updatedMenus = [...this.menus];
      const oldMenuIndex = updatedMenus.findIndex(p => p.id === id);
      const menu: Menu = {
        id: id,
        title: title,
        description: description,
        items: {
          entree: ['chopped liver', 'confit tuna', 'hommus', 'romanian eggplant'],
          main: [
            'Slow Cooked Lamb Shoulder',
            'Grilled Ora king salmon',
            'Ocean trout tarator',
            'Slow Braised Free Range Chicken'
          ],
          soup: 'Holmbrae chicken and vegetable soup',
          desert: []
        }
      };
      updatedMenus[oldMenuIndex] = menu;
      this.menus = updatedMenus;
      this.menusUpdated.next([...this.menus]);
    });
  }

  deleteMenu(id: String) {
    this.http.delete(BACKEND_URL + id).subscribe(result => {
      // filter returns all entries where the  condition === true and removes entries where the condition === false
      const updateMenus = this.menus.filter(menu => menu.id !== id);
      // update menus array with filtered result
      this.menus = updateMenus;
      // inform UI
      this.menusUpdated.next([...this.menus]);
      console.log(result);
    });
  }
}
