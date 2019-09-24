import { Component, OnInit, OnDestroy, Output, Input, ViewChild, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataService } from '../../services/menu.service';
import { DishService } from '../../services/dish.service';
import { Menu } from '../../models/menu.model';

import { AddItemDialogComponent } from '../../dialogs/add-item-dialog/add-item-dialog.component';
import { DeleteItemComponent } from '../../dialogs/delete-item/delete-item.component';


@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.component.html',
  styleUrls: ['./menu-details.component.css']
})
export class MenuDetailsComponent implements OnInit, OnDestroy {

  private _selectedItem = null;
  private _formMode = '';
  menusData: Menu[] = [];
  menuItems: any = [];
  form: FormGroup;

  private dishesAddedSub: Subscription;
  private dishesDeletedSub: Subscription;
  private dishesSub: Subscription;

  inputDisabled = true;
  disableSubmit = true;
  createMode = true;
  submitted = false;
  isLoading = false;
  isDuplicate = false;

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
      description: 'Lox\'s famous chick pea hummus used at the restaurant',
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
    private dishService: DishService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  @Output()
  notify = new EventEmitter<boolean>();

  @Input('mode')
  set mode(mode: string) {
    this._formMode = mode;
  }

  @Input('selectedItem')
  set selectedItem(selectedItem: any) {
    this._selectedItem = selectedItem;
  }

  get mode(): string {
    return this._formMode;
  }

  get selectedItem(): any {
    return this._selectedItem;
  }

  get f() {
    return this.form.controls;
  }

  getMode() {
    return this._formMode;
  }

  getSelectedItemId() {
    console.log(this._selectedItem);
    return this._selectedItem._id;
  }

  notifyParent() {
    // console.log('notifying parent');
    this.form.reset();
    this.notify.emit(true);
  }

  ngOnInit() {
    this.init();
    this.dishService.getDishes();
    this.dishesSub = this.dishService.getDishesUpdateListener().subscribe((data) => {
      this.menuItems = data;
    })

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
  }

  initForm() {
    console.log(this._selectedItem);
    this.form = this.formBuilder.group({
      title: [{ value: '', disabled: this.inputDisabled }, [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]],
      description: [
        { value: '', disabled: this.inputDisabled },
        [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]
      ]
    });
  }

  init() {
    const mode = this.getMode();
    switch (mode) {
      case 'create':
        this.createMode = true;
        this.inputDisabled = false;
        this.initForm();
        break;
      case 'view':
        this.createMode = false;
        this.inputDisabled = true;
        this.initForm();
        break;
      default:
        this.createMode = false;
        break;
    }
  }
  enableSubmit() {
    this.disableSubmit = false;
  }

  disableForm() {
    this.form.controls.title.reset({ value: this.selectedItem.title, disabled: true });
    this.form.controls.description.reset({ value: this.selectedItem.description, disabled: true });
  }

  enableForm() {
    this.form.controls.title.reset({ value: this.selectedItem.title, disabled: false });
    this.form.controls.description.reset({ value: this.selectedItem.description, disabled: false });
  }

  resetForm() {
    this.form.controls.title.reset({ value: '', disabled: false });
    this.form.controls.description.reset({ value: '', disabled: false });
  }

  updateFormMode(mode) {
    if (mode === 'create') {
      this.createMode = true;
      this.inputDisabled = false;
      this.disableSubmit = true;
      this.resetForm();
    }
    if (mode === 'edit') {
      this.createMode = false;
      this.inputDisabled = false;
      this.enableForm();
    }
    if (mode === 'view') {

      this.createMode = true;
      this.inputDisabled = true;
      this.disableForm();
    }
    if (mode === null) {
      this.inputDisabled = true;
      this.submitted = false;
      this.disableForm();
    }
    this.mode = mode;
  }

  onSaveMenu() {
    this.submitted = true;
    if (this.form.invalid) {
      console.log('form is invalid');
      return;
    }

    const newMenu = {
      _id: this._selectedItem._id,
      title: this.form.value.title,
      description: this.form.value.description,
      items: this.selectedItem.items
    };

    console.log(newMenu);

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

  onDeleteMenu(id: String) {
    console.log(`dish set for deletion - id: ${id}`);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.height = '200px';
    dialogConfig.maxWidth = '100%';
    dialogConfig.data = 'Type the word DELETE to delete this item';
    const dialogRef = this.dialog.open(DeleteItemComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(dialogReturnData => {
      if (dialogReturnData === 'DELETE') {
        this.dataService.deleteMenu(id);
      }
    });

  }

  onAddItems() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.height = '85%';
    dialogConfig.maxWidth = '100%';
    dialogConfig.data = [this.menuItems, this.selectedItem.items];
    const dialogRef = this.dialog.open(AddItemDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(dialogReturnData => {
      // this.menuItems = dialogReturnData;
      if (dialogReturnData !== undefined) {
        console.log(dialogReturnData);
        this.dataService.ondDishesAdded(dialogReturnData);
      }
    });
  }

  onDeleteDish(menuIdx, dishName) {
    this.dataService.deleteDishFromMenu(menuIdx, dishName);
  }

  ngOnDestroy() {
    this.dishesAddedSub.unsubscribe();
    this.dishesDeletedSub.unsubscribe();
    this.dishesSub.unsubscribe();
  }
}
