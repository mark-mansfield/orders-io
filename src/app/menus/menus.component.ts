import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../services/menu.service';
import { Subscription } from 'rxjs';
import { Menu } from '../models/menu.model';
import { SnackBarService } from '../services/snackbar.service';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit, OnDestroy {
  menusData: Menu[] = [];

  selectedItem: any;
  items: any = [];

  private menusSub: Subscription;
  private menusFilteredSub: Subscription;
  private searchResultsCleared: Subscription;
  private menuDeletedSub: Subscription;


  formMode = null;
  isLoading = false;
  deviceToolBarVisible = true;
  searchVisible = false;
  listVisible = true;
  isSearching = false;
  hasSearchResults = false;
  formVisible = false;





  constructor(

    private snackBarService: SnackBarService,
    private dataService: DataService,

  ) { }



  ngOnInit() {

    this.dataService.getMenus();

    this.isLoading = true;



    this.menusSub = this.dataService.getMenuMetaDataUpdatedListener().subscribe((menus: Menu[]) => {
      this.isLoading = false;
      this.isSearching = false;
      this.menusData = menus;
    });

    this.menusFilteredSub = this.dataService.getMenusFilteredListener().subscribe((menus: Menu[]) => {
      this.toggleViews('search');
      if (menus.length === 0) {
        this.snackBarService.openSnackBar('no menus found by that name');
      } else if (menus.length > 0) {
        this.hasSearchResults = true;
        this.menusData = menus;
        this.isSearching = true;
      }
    });

    this.menuDeletedSub = this.dataService.getMenuDeletedListener().subscribe(() => {
      this.toggleViews('default');
    });

    this.searchResultsCleared = this.dataService.getSearchResultsClearedListener().subscribe((menus: Menu[]) => {
      this.menusData = menus;
    });
  }

  initSelectedItem() {
    console.log(this.menusData);
    this.selectedItem = {
      title: '',
      description: '',
      items: []
    };
  }

  toggleViews(view) {

    switch (view) {
      case 'create':
        this.deviceToolBarVisible = false;
        this.searchVisible = false;
        this.listVisible = false;
        this.formVisible = true;
        this.formMode = 'create';
        this.initSelectedItem();
        break;

      case 'search':
        this.deviceToolBarVisible = false;
        this.searchVisible = true;
        this.listVisible = false;
        this.isSearching = true;
        this.hasSearchResults = false;
        break;

      case 'import':
        this.searchVisible = false;
        this.listVisible = false;
        break;

      case 'view-item':
        this.deviceToolBarVisible = false;
        this.isSearching = false;
        this.hasSearchResults = false;
        this.formVisible = true;
        this.formMode = 'view';
        break;

      default:
        this.deviceToolBarVisible = true;
        this.searchVisible = false;
        this.listVisible = true;
        this.isSearching = false;
        this.hasSearchResults = false;
        this.formVisible = false;
        break;
    }
  }

  onItemSelect($event) {

    this.selectedItem = {
      _id: $event._id,
      title: $event.title,
      description: $event.description,
      items: $event.items
    };
    this.toggleViews('view-item');

  }

  onFilterByName(name) {
    this.dataService.filterByName(name);
  }

  onClearSearchResults() {
    this.toggleViews('search');
    this.dataService.clearSearchResults();
  }

  onNotifyClicked(event: boolean): void {
    console.log(event);
    this.toggleViews('default');
  }


  ngOnDestroy() {
    this.menusSub.unsubscribe();
    this.menuDeletedSub.unsubscribe();
    this.menusFilteredSub.unsubscribe();
    this.searchResultsCleared.unsubscribe();
  }
}
