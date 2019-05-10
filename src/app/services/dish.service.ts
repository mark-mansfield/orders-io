import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dish } from '../models/dish.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + 'menus/';

@Injectable({ providedIn: 'root' })
export class DataService {
  private dishes: Dish[] = [];
  private dishesUpdated = new Subject<Dish[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getMenus() {
    return this.http
      .get<{ id: string; message: string; dishes: any }>(BACKEND_URL)
      .pipe(
        map(data => {
          // transform object back into a new object
          return data.dishes.map(menu => {
            // server creates _id:, we want to use id: like our model suggests.
            return {
              // title: menu.title,
              // description: menu.description,
              // id: menu._id,
              // imagePath: menu.imagePath,
              // creator: menu.creator
            };
          });
        })
      )
      .subscribe(transformedData => {
        this.dishes = transformedData;
        this.dishesUpdated.next([...this.dishes]);
      });
  }

  getDishesUpdateListener() {
    return this.dishesUpdated.asObservable();
  }

  getDish(id: string) {
    return this.http.get<{
      // _id: string;
      // title: string;
      // description: string;
      // imagePath: string;
      // creator: string;
    }>(BACKEND_URL + id);
  }

  addDish(name: string, description: string, portion_sizes: any, course: string) {
    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('portion_sizes', portion_sizes);
    data.append('course', course);

    this.http.post<{ message: string; dish: Dish }>(BACKEND_URL, data).subscribe(returnedData => {
      const dish: Dish = {
        id: returnedData.dish.description,
        name: returnedData.dish.name,
        description: returnedData.dish.description,
        portion_sizes: returnedData.dish.portion_sizes,
        course: returnedData.dish.course
        // id: returnedData.menu.id,
        // title: title,
        // description: description,
        // creator: null
      };
      console.log(returnedData.message);
      this.dishes.push(dish);
      this.dishesUpdated.next([...this.dishes]); // inform UI
      this.router.navigate(['/list-menus']);
    });
  }

  updateDish(id: string, name: string, description: string, portion_sizes: any, course: string) {
    let data: Dish | FormData;
    data = {
      id: id,
      name: name,
      description: description,
      portion_sizes: portion_sizes,
      course: course
    };

    // const menu: Menu = { id: id, title: title, description: description, imagePath: imagePath };
    this.http.put(BACKEND_URL + id, data).subscribe(response => {
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
