import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/menu.service';
import { Subscription } from 'rxjs';
import { Menu } from '../models/menu.model';
@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit, OnDestroy {
  menusData: Menu[] = [];
  menuItems: any;
  form: FormGroup;
  mode: string;

  private menusSub: Subscription;

  inputDisabled: Boolean = true;
  disableEditTools: Boolean = false;
  editMode: Boolean = false;
  createMode: Boolean = false;
  submitted: Boolean = false;
  isLoading: Boolean = false;

  selectedItem = null;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {}

  ngOnInit() {
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
    this.menusSub = this.dataService.getMenuUpdateListener().subscribe((menus: Menu[]) => {
      this.isLoading = false;
      this.menusData = menus;
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  updateFormMode(mode) {
    if (mode === 'create') {
      this.mode = mode;
      this.selectedItem = {};
      this.form.controls.title.reset({ value: this.selectedItem.name, disabled: false });
      this.form.controls.description.reset({ value: this.selectedItem.description, disabled: false });
    }
    if (mode === 'edit') {
      this.inputDisabled = false;
      this.mode = mode;
      this.form.controls.title.reset({ value: this.selectedItem.name, disabled: false });
      this.form.controls.description.reset({ value: this.selectedItem.description, disabled: false });
    }
    if (mode === 'view') {
      this.form.controls.dishName.reset({ value: this.selectedItem.name, disabled: true });
      this.form.controls.description.reset({ value: this.selectedItem.description, disabled: true });
      this.inputDisabled = true;
    }

    this.mode = mode;
    console.log(this.mode);
  }

  toggleEditTools() {
    this.disableEditTools = false;
    this.createMode = false;
  }

  onItemSelect($event) {
    console.log(this.selectedItem);
    // this.selectedItem = $event;
    // this.updateFormMode('view');
    // this.toggleEditTools();
  }

  onSaveMenu() {
    this.submitted = true;
    this.menuItems = null;
    if (this.form.invalid) {
      console.log('form is invalid');
      return;
    }
    const newMenu = {
      title: this.form.value.title,
      descriptiomn: this.form.value.description,
      items: this.menuItems
    };
    this.dataService.addMenu(newMenu);
  }

  onDelete(id: String) {
    this.dataService.deleteMenu(id);
  }

  ngOnDestroy() {
    this.menusSub.unsubscribe();
  }
}
