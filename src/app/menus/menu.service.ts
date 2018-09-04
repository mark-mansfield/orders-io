import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Menu } from './menu.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + 'menus/';

@Injectable({providedIn: 'root'})


export class DataService {

  private menus: Menu[] = [];
  private menusUpdated = new Subject<Menu[]>();


  constructor(private http: HttpClient,  private router: Router) { }

  getMenus() {
    return this.http.get<{id: string, message: string, menus: any}>(BACKEND_URL)
    .pipe(map((menuData) => {
      // transform object back into a new object
      return menuData.menus.map(menu => {
        // server creates _id:, we want to use id: like our model suggests.
        return {
            title: menu.title,
            description: menu.description,
            id: menu._id,
            imagePath: menu.imagePath,
            creator: menu.creator
        };
      });
    }))
    .subscribe((transformedMenuData) => {
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
        description: string,
        imagePath: string,
        creator: string }>(BACKEND_URL + id);
  }

  addMenu( title: string, description: string, image: File) {
    const menuData = new FormData();
    menuData.append('title' , title);
    menuData.append('description' , description);
    menuData.append('image' , image, title);
    // add to server then update local if successful
    this.http
      .post<{message: string; menu: Menu }>(
        BACKEND_URL,
        menuData
      )
      .subscribe(returnedData => {
        const menu: Menu = {
          id: returnedData.menu.id,
          title: title,
          description: description,
          imagePath: returnedData.menu.imagePath,
          creator: null
        };
        console.log(returnedData.message) ;
        this.menus.push(menu);
        this.menusUpdated.next([...this.menus]); // inform UI
        this.router.navigate(['/list-menus']);
   });

  }

  updateMenu(id: string, title: string, description: string, image: File |string, creator: string) {
    let menuData: Menu | FormData;
    if (typeof image === 'object') {
      menuData = new FormData();
      menuData.append('id', id);
      menuData.append('title', title);
      menuData.append('description', description);
      menuData.append('image', image, title);
      menuData.append('creator', creator);
    } else {
      menuData = {
        id: id,
        title: title,
        description: description,
        imagePath: image,
        creator: null
      };
    }

    // const menu: Menu = { id: id, title: title, description: description, imagePath: imagePath };
    this.http
    .put(BACKEND_URL + id , menuData)
    .subscribe(response => {
      const updatedMenus = [...this.menus];
      const oldMenuIndex = updatedMenus.findIndex(p => p.id === id);
      const menu: Menu = {
        id: id,
        title: title,
        description: description,
        imagePath: '',
        creator: creator
      };
      updatedMenus[oldMenuIndex] = menu;
      this.menus = updatedMenus;
      this.menusUpdated.next([...this.menus]);
      this.router.navigate(['/list-menus']);
    });
  }

  deleteMenu(id: String) {
    this.http.delete(BACKEND_URL + id)
      .subscribe(result => {
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
