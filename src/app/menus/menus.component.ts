import { Component, OnInit, OnDestroy } from '@angular/core';
// TODO put this in menu-datails compnent
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DeleteItemComponent } from '../dialogs/delete-item/delete-item.component';
import { AddItemDialogComponent } from '../dialogs/add-item-dialog/add-item-dialog.component';
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
  menuItems: any = [];
  // TODO put this in menu-datails compnent
  form: FormGroup;
  // TODO put this in menu-datails compnent
  mode: string;

  private menusSub: Subscription;
  private menusFilteredSub: Subscription;
  private searchResultsCleared: Subscription;
  private menuDeletedSub: Subscription;
  private dishesAddedSub: Subscription;
  private dishesDeletedSub: Subscription;

  // TODO put this in menu-datails compnent
  inputDisabled = true;
  disableSubmit = true;

  // TODO put this in menu-datails compnent
  submitted = false;
  isLoading = false;
  // TODO put this in menu-datails compnent
  createMode = false;
  // TODO put this in menu-datails compnent
  isDuplicate = false;
  deviceToolBarVisible = true;
  hasSearchResults = false;
  isSearching = false;
  searchVisible = false;
  listVisible = false;
  // TODO put this in menu-datails compnent
  formVisible = false;

  selectedItem: any;

  items: any = [];

  data = [
    {
      name: 'Slow Cooked Lamb Shoulder',
      description: 'Hawaiij spices, pomegranate molasses, honey and lemon w coriander and almonds',
      portion_sizes: [1, 2, 3],
      course: 'main'
    },
    {
      name: 'Grilled Ora king salmon',
      description: 'chermoula marinade, cherry tomato and green bean salsa',
      portion_sizes: [1, 2, 3],
      course: 'main'
    },
    {
      name: 'Ocean trout tarator',
      description: 'w tahini yoghurt, coriander, sumac and chilli',
      portion_sizes: [1, 2, 3],
      course: 'main'
    },
    {
      name: 'Slow Braised Free Range Chicken',
      description: 'Jerusalem artichokes, bay, lemon, olives, eschallots , dates (Legs and thighs - 18 pieces)',
      portion_sizes: [1, 2],
      course: 'main'
    },
    {
      name: 'chopped liver',
      description: 'w caramelised onions egg &amp; herb mayo',
      portion_sizes: ['250', '500', '1kg'],
      course: 'entree'
    },
    {
      name: 'hommus',
      description: "Lox's famous chick pea hummus used at the restaurant",
      portion_sizes: ['250', '500', '1kg'],
      course: 'entree'
    },
    {
      name: 'confit tuna',
      description: 'Olive oil, caper and parsley dip',
      portion_sizes: ['250', '500', '1kg'],
      course: 'entree'
    },
    {
      name: 'Romanian eggplant',
      description: 'roasted eggplant, capsicum, pomegranate, dill, lemon, shallot)',
      portion_sizes: ['250', '500', '1kg'],
      course: 'entree'
    },
    {
      name: 'holmbrae chicken and vegetable ',
      description: 'DF',
      portion_sizes: ['250', '500', '1kg'],
      course: 'soup'
    }
  ];

  constructor(
    private snackBarService: SnackBarService,
    private dataService: DataService,
    // TODO put this in menu-datails compnent
    private formBuilder: FormBuilder,
    // TODO put this in menu-datails compnent
    public dialog: MatDialog) { }

  initSelectedItem() {
    this.selectedItem = {
      _id: '',
      title: '',
      description: '',
      items: ''
    };
  }

  ngOnInit() {
    console.log(this.formVisible);
    this.submitted = false;
    this.form = this.formBuilder.group({
      title: [{ value: '', disabled: this.inputDisabled }, [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]],
      description: [
        { value: '', disabled: this.inputDisabled },
        [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]
      ]
    });

    this.dataService.getMenus();
    this.isLoading = true;

    this.menusSub = this.dataService.getMenuMetaDataUpdatedListener().subscribe((menus: Menu[]) => {
      this.isLoading = false;
      this.isSearching = false;
      this.menusData = menus;
      if (this.mode === 'create') {
        // get the last item in array i.e. newly created item
        const lastItem = this.menusData.slice(-1);
        this.selectedItem = lastItem[0];
        console.log(this.selectedItem);
        this.mode = 'edit';
      }
      // this.mode = null;
      this.submitted = false;
    });

    this.menusFilteredSub = this.dataService.getMenusFilteredListener().subscribe((menus: Menu[]) => {
      this.toggleViews('search');
      if (menus.length === 0) {
        this.snackBarService.openSnackBar('no menus found by that name')
      } else if (menus.length > 0) {
        this.hasSearchResults = true;
        this.menusData = menus;
      }
      this.isSearching = true;

    });

    this.menuDeletedSub = this.dataService.getMenuDeletedListener().subscribe(() => {
      //  update UI and form mode
      this.toggleViews('default');
      this.mode = null;
      // this.updateFormMode(null);
    });

    this.dishesDeletedSub = this.dataService.getDishesDeletedListener().subscribe((items: any) => {
      this.selectedItem.items = items;
      this.disableSubmit = false;
    });

    this.dishesAddedSub = this.dataService.getDishesAddedListener().subscribe((dishes: any[]) => {
      if (this.selectedItem.items == null) {
        this.selectedItem.items = [];
      }
      this.selectedItem.items = [];
      dishes.forEach(element => {
        this.selectedItem.items.push(element);
      });
      this.disableSubmit = false;
    });

    this.searchResultsCleared = this.dataService.getSearchResultsClearedListener().subscribe((menus: Menu[]) => {
      this.menusData = menus;
    });

    this.toggleViews('default');
  }

  // TODO put this in menu-datails compnent
  enableSubmit() {
    this.disableSubmit = false;
  }

  // TODO put this in menu-datails compnent
  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  // TODO put this in menu-datails compnent
  disableForm() {
    this.form.controls.title.reset({ value: this.selectedItem.title, disabled: true });
    this.form.controls.description.reset({ value: this.selectedItem.description, disabled: true });
  }

  // TODO put this in menu-datails compnent
  enableForm() {
    this.form.controls.title.reset({ value: this.selectedItem.title, disabled: false });
    this.form.controls.description.reset({ value: this.selectedItem.description, disabled: false });
  }

  // TODO put this in menu-datails compnent
  // custom form reset
  resetForm() {
    this.form.controls.title.reset({ value: '', disabled: false });
    this.form.controls.description.reset({ value: '', disabled: false });
  }

  // TODO put this in menu-datails compnent
  updateFormMode(mode) {
    if (mode === 'create') {
      this.createMode = true;
      this.formVisible = true;
      this.inputDisabled = false;
      this.disableSubmit = true;
      this.selectedItem = {
        // No _id prop as this object will be sent to the backend and have the _id prop added
        title: null,
        description: null,
        items: null
      };

      this.resetForm();
    }
    if (mode === 'edit') {
      this.createMode = true;
      this.inputDisabled = false;
      this.enableForm();
    }
    if (mode === 'view') {

      this.createMode = true;
      this.inputDisabled = true;
      this.disableForm();
      console.log('viewing an order');
      console.log(`formVisible : ${this.formVisible}`);
    }
    if (mode === null) {
      this.inputDisabled = true;
      this.submitted = false;
      this.initSelectedItem();
      this.disableForm();
    }
    this.mode = mode;

  }

  toggleViews(view) {

    switch (view) {
      case 'create':
        this.deviceToolBarVisible = false;
        this.searchVisible = false;
        this.listVisible = false;
        this.createMode = true;
        this.updateFormMode('create');

        break;

      case 'search':
        this.deviceToolBarVisible = false;
        this.searchVisible = true;
        this.listVisible = false;
        this.createMode = false;
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
        this.disableSubmit = true;

        this.updateFormMode('view');

      default:
        this.deviceToolBarVisible = true;
        this.searchVisible = false;
        this.listVisible = true;

        this.updateFormMode(null);
        this.isSearching = false;
        this.hasSearchResults = false;
        break;
    }
  }

  onViewOrder($event) {

    this.selectedItem = {
      _id: $event._id,
      title: $event.title,
      description: $event.description,
      items: $event.items
    }
    this.toggleViews('view-item');

  }

  onFilterByName(name) {
    this.dataService.filterByName(name);
  }

  onClearSearchResults() {
    this.toggleViews('search');
    this.dataService.clearSearchResults();
  }

  onDeleteDish(menuIdx, dishName) {
    this.dataService.deleteDishFromMenu(menuIdx, dishName);
  }

  // TODO put this in menu-datails compnent
  onSaveMenu() {
    this.submitted = true;

    if (this.form.invalid) {
      console.log('form is invalid');
      return;
    }

    const newMenu = {
      _id: this.selectedItem._id,
      title: this.form.value.title,
      description: this.form.value.description,
      items: this.selectedItem.items
    };

    if (this.mode === 'create') {
      // duplicate titles are not allowed.
      const duplicate = this.menusData.filter(menu => menu.title === this.form.value.title);
      if (duplicate.length > 0) {
        this.form.controls['title'].setErrors({ duplicate: true });
        this.isDuplicate = true;
        return;
      } else {
        this.dataService.addMenu(newMenu);
      }
    }

    if (this.mode === 'edit') {
      this.dataService.updateMenu(newMenu);
    }
  }

  // TODO put this in menu-datails compnent
  onDeleteMenu(id: String) {
    console.log(`dish set for deletion - id: ${id}`);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.height = '20%';
    dialogConfig.width = '20%';
    dialogConfig.data = 'Type the word DELETE to delete this item';
    const dialogRef = this.dialog.open(DeleteItemComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(dialogReturnData => {
      if (dialogReturnData === 'DELETE') {
        this.dataService.deleteMenu(id);
      }
    });
    // this.dataService.deleteMenu(id);
  }

  // TODO put this in menu-datails compnent
  onAddItems() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.height = '500px';
    dialogConfig.width = '400px';
    dialogConfig.data = [this.data, this.selectedItem.items];
    const dialogRef = this.dialog.open(AddItemDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(dialogReturnData => {
      // this.menuItems = dialogReturnData;
      if (dialogReturnData !== undefined) {
        console.log(dialogReturnData);
        this.dataService.ondDishesAdded(dialogReturnData);
      }
    });
  }

  ngOnDestroy() {
    this.menusSub.unsubscribe();
    this.menuDeletedSub.unsubscribe();
    this.menusFilteredSub.unsubscribe();
    this.dishesAddedSub.unsubscribe();
    this.dishesDeletedSub.unsubscribe();
    this.searchResultsCleared.unsubscribe();
  }
}
