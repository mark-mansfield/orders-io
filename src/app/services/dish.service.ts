import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dish } from '../models/dish.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnackBarService } from './snackbar.service';
import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl + 'dishes/';

@Injectable({ providedIn: 'root' })
export class DishService {
  private dishes: Dish[] = [];
  private dishesUpdated = new Subject<Dish[]>();
  private dishesFiltered = new Subject<Dish[]>();
  private dishAdded = new Subject<Dish[]>();
  private dishDeleted = new Subject();
  private dishMetaDataUpdated = new Subject<Dish[]>();
  private searchResultsCleared = new Subject<Dish[]>();
  constructor(
    private http: HttpClient,

    private snackBarService: SnackBarService
  ) { }

  getDishesUpdateListener() {
    return this.dishesUpdated.asObservable();
  }

  getDishesFilteredListener() {
    return this.dishesFiltered.asObservable();
  }

  getDishMetaDataUpdated() {
    return this.dishMetaDataUpdated.asObservable();
  }

  getDishAddedListener() {
    return this.dishAdded.asObservable();
  }

  getSearchResultsClearedListener() {
    return this.searchResultsCleared.asObservable();
  }

  getDishes() {
    return this.http
      .get<{ id: string; message: string; dishes: any }>(BACKEND_URL)
      .pipe(
        map(dishData => {
          // transform object back into a new object
          return dishData.dishes.map(dish => {
            // server creates _id:, we want to use id: like our model suggests.
            return {
              name: dish.name,
              description: dish.description,
              portion_sizes: dish.portion_sizes,
              _id: dish._id,
              course: dish.course
            };
          });
        })
      )
      .subscribe(transformedMenuData => {
        this.dishes = transformedMenuData;
        this.dishesUpdated.next([...this.dishes]);
      });
  }

  addDish(dish) {
    console.log(dish);

    this.http.post<{ message: string; dish: any }>(BACKEND_URL + 'create', dish).subscribe(returnedData => {
      console.log(returnedData);

      if (returnedData.message === '0') {
        this.dishes.push(returnedData.dish);
        this.dishAdded.next([...this.dishes]); // inform UI
        this.snackBarService.openSnackBar('Dish Added!');
      } else if (returnedData.message === '1') {
        this.snackBarService.openSnackBar('You are not authorized to perform this action');
      } else {
        this.snackBarService.openSnackBar(returnedData);
      }
    });
  }

  updateDish(dish) {
    console.log(dish);
    this.http.put<{ message: string; menu: any }>(BACKEND_URL + 'update', dish).subscribe(returnedData => {
      console.log(returnedData.message);
      if (returnedData.message) {
        const idx = this.dishes.findIndex(p => p._id === dish._id);
        this.dishes[idx] = dish;
        this.dishMetaDataUpdated.next([...this.dishes]); // inform UI
        this.snackBarService.openSnackBar('Dish updated');
      } else {
        this.snackBarService.openSnackBar('Dish not deleted due to server error; retry');
      }
    });
  }

  deleteDish(id: String) {
    this.http.delete<{ message: any }>(BACKEND_URL + id).subscribe(returnedData => {
      console.log(returnedData.message === '0');

      if (returnedData.message === '0') {
        const updateDishes = this.dishes.filter(dish => dish._id !== id);
        this.dishes = updateDishes;
        this.dishMetaDataUpdated.next([...this.dishes]); // inform UI
        this.dishDeleted.next(); // inform UI
        this.snackBarService.openSnackBar('Dish Deleted!');
      } else if (returnedData.message === '1') {
        this.snackBarService.openSnackBar('You are not authorized to perform this action');
      } else {
        this.snackBarService.openSnackBar(returnedData.message);
      }
    });
  }

  filterByName(name) {
    const filteredData = [...this.dishes].filter(function (item) {
      return item.name.toLowerCase().includes(name.toLowerCase());
    });
    this.dishesFiltered.next([...filteredData]);
  }

  filterByCourse(course) {
    if (course === 'all') {
      this.dishesFiltered.next([...this.dishes]);
      return;
    }
    const filteredData = [...this.dishes].filter(function (item) {
      return item.course.toLowerCase().includes(course.toLowerCase());
    });
    this.dishesFiltered.next([...filteredData]);
  }

  clearSearchResults() {
    this.dishMetaDataUpdated.next([...this.dishes]);
  }
}
