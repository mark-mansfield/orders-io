import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DeleteItemComponent } from '../dialogs/delete-item/delete-item.component';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { DishService } from '../services/dish.service';
import { Dish } from '../models/dish.model';
@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit, OnDestroy {
  form: FormGroup;
  dishes = [];
  data = [];
  COURSE_OPTIONS = environment.courseOptions;
  selectedItem = null;

  mode: string;
  inputDisabled = true;
  submitted = false;
  isLoading = false;
  createMode = false;
  isDuplicate = false;
  disableSubmit = true;

  noSearchResults = false;
  isSearching = false;
  searchVisible = false;
  listVisible = false;
  formVisible = false;

  private dishesLoaded: Subscription;
  private dishesFiltered: Subscription;
  private dishMetaDataUpdated: Subscription;
  private dishesAdded: Subscription;
  private dishesDeleted: Subscription;
  private searchResultsCleared: Subscription;


  constructor(private formBuilder: FormBuilder, private dataService: DishService, public dialog: MatDialog) { }

  ngOnInit() {
    this.isLoading = true;
    this.dataService.getDishes();

    this.dishesLoaded = this.dataService.getDishesUpdateListener().subscribe((data: Dish[]) => {
      this.dishes = data;
      this.data = data;
      this.isLoading = false;
      console.log(this.dishes);
    });

    this.dishesDeleted = this.dataService.getDishesUpdateListener().subscribe((data: Dish[]) => {
      this.dishes = data;
      this.data = data;
    });

    this.dishMetaDataUpdated = this.dataService.getDishMetaDataUpdated().subscribe((data: Dish[]) => {
      this.dishes = data;
    });

    this.searchResultsCleared = this.dataService.getSearchResultsClearedListener().subscribe((data: Dish[]) => {
      this.dishes = data;
    });

    this.dishesAdded = this.dataService.getDishAddedListener().subscribe((data: Dish[]) => {
      this.dishes = data;
      this.data = data;
      console.log(data);
      const lastItem = this.dishes.slice(-1);
      this.selectedItem = lastItem[0];
      this.mode = 'edit';
      console.log(this.selectedItem);
      console.log(this.mode);
    });

    this.dishesFiltered = this.dataService.getDishesFilteredListener().subscribe((data: Dish[]) => {
      console.log(data);
      if (data.length === 0) {
        this.noSearchResults = true;
      } else if (data.length > 0) {
        this.noSearchResults = false;
      }
      this.isLoading = false;

      this.dishes = data;
    });

    this.submitted = false;
    this.form = this.formBuilder.group({
      dishName: [
        { value: '', disabled: this.inputDisabled },
        [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]
      ],
      description: [
        { value: '', disabled: this.inputDisabled },
        [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]
      ],
      portion_sizes: [
        { value: '', disabled: this.inputDisabled },
        [Validators.required]
      ],
      course: [{ value: '', disabled: this.inputDisabled }, [Validators.required]]
    });

    this.toggleViews('default');

    // console.log(this.COURSE_OPTIONS);
  }

  ngOnDestroy() {
    this.dishesLoaded.unsubscribe();
    this.dishesFiltered.unsubscribe();
    this.dishMetaDataUpdated.unsubscribe();
    this.dishesAdded.unsubscribe();
    this.dishesDeleted.unsubscribe();
    this.searchResultsCleared.unsubscribe();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  disableForm() {
    this.form.controls.dishName.reset({ value: this.selectedItem.name, disabled: true });
    this.form.controls.description.reset({ value: this.selectedItem.description, disabled: true });
    this.form.controls.portion_sizes.reset({ value: this.selectedItem.portion_sizes, disabled: true });
    this.form.controls.course.reset({ value: this.selectedItem.course, disabled: true });
    this.inputDisabled = true;
  }

  enableForm() {
    this.form.controls.dishName.reset({ value: this.selectedItem.name, disabled: false });
    this.form.controls.description.reset({ value: this.selectedItem.description, disabled: false });
    this.form.controls.portion_sizes.reset({ value: this.selectedItem.portion_sizes, disabled: false });
    this.form.controls.course.reset({ value: this.selectedItem.course, disabled: false });
  }

  // custom form reset
  resetForm() {
    this.form.controls.dishName.reset({ value: '', disabled: false });
    this.form.controls.description.reset({ value: '', disabled: false });
    this.form.controls.portion_sizes.reset({ value: '', disabled: false });
    this.form.controls.course.reset({ value: '', disabled: false });
  }

  initFormSelectsWithSelectedValues() {

    const selectedCourseIndex = this.COURSE_OPTIONS.findIndex(item => item === this.selectedItem.course);
    this.form.get('course').setValue(this.COURSE_OPTIONS[selectedCourseIndex]);
    console.log(`course for this dish: ${this.selectedItem.course}`);
    console.log(`index of selected course for this dish: ${selectedCourseIndex}`);

  }

  initSelectedItem() {
    this.selectedItem = {
      _id: '',
      name: '',
      description: '',
      portion_sizes: '',
      course: ''
    };
  }

  updateFormMode(mode) {
    if (mode === 'create') {
      this.resetForm();
      this.initSelectedItem();
      this.enableForm();
      this.inputDisabled = false;
    }
    if (mode === 'edit') {
      this.createMode = true;
      this.inputDisabled = false;
      this.enableForm();
    }
    if (mode === 'view') {
      this.formVisible = true;
      this.createMode = true;
      this.inputDisabled = true;
      this.disableForm();
    }
    if (mode === null) {
      this.inputDisabled = true;
      this.submitted = false;
      this.initSelectedItem();
      this.disableForm();
    }
    this.mode = mode;
    console.log(this.mode);
  }

  toggleViews(view) {
    console.log(view);
    switch (view) {
      case 'create':
        this.searchVisible = false;
        this.listVisible = false;
        this.createMode = true;
        this.formVisible = true;
        this.initSelectedItem();
        this.updateFormMode('create');
        break;

      case 'search':
        this.searchVisible = true;
        this.listVisible = false;
        this.createMode = false;
        break;

      default:
        this.searchVisible = false;
        this.listVisible = true;
        this.formVisible = false;
        this.updateFormMode(null);
        this.isSearching = false;
        break;
    }
  }

  onFilterByCourse(course) {
    this.isSearching = true;
    this.isLoading = true;
    this.dataService.filterByCourse(course);

  }

  onFilterByName(name) {
    this.isSearching = true;
    this.isLoading = true;
    this.dataService.filterByName(name);
  }

  onClearSearchResults() {
    this.toggleViews('search');
    this.dataService.clearSearchResults();
  }

  onSelectCourse(course) {
    console.log(course);
    this.form.controls.course.reset({ value: course, disabled: false });
  }

  onItemSelect($event) {

    this.isSearching = false;
    this.disableSubmit = true;
    this.selectedItem = {
      _id: $event._id, // because this value comes from mongo db and  already has the _id prop
      name: $event.name,
      description: $event.description,
      portion_sizes: $event.portion_sizes,
      course: $event.course
    };

    this.formVisible = true;
    this.initFormSelectsWithSelectedValues();
    console.log($event);
  }

  onSaveDish() {
    this.submitted = true;

    if (this.form.invalid) {
      console.log('form is invalid');
      console.log(this.form);
      return;
    }
    console.log(`form mode is set to: ${this.mode}`);

    if (this.mode === 'create') {
      const newDish = {
        _id: undefined,
        name: this.form.value.dishName,
        description: this.form.value.description,
        portion_sizes: this.form.value.portion_sizes,
        course: this.form.value.course
      };


      // duplicate titles are not allowed.
      const duplicate = this.dishes.filter(dish => dish.name === this.form.value.name);
      if (duplicate.length > 0) {
        this.form.controls['title'].setErrors({ duplicate: true });
        this.isDuplicate = true;
        return;
      } else {
        console.log('no dupes found , saving dish....');
        this.dataService.addDish(newDish);
      }
    }

    if (this.mode === 'edit') {
      const newDish = {
        _id: this.selectedItem._id,
        name: this.form.value.dishName,
        description: this.form.value.description,
        portion_sizes: this.form.value.portion_sizes,
        course: this.form.value.course
      };

      console.log(newDish);
      this.dataService.updateDish(newDish);
    }
  }

  onDeleteDish(id: String) {
    console.log(`dish set for deletion - id: ${id}`);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.height = '200px';
    dialogConfig.maxWidth = '100%';
    dialogConfig.data = 'Type the word DELETE to delete this item';
    const dialogRef = this.dialog.open(DeleteItemComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(dialogReturnData => {
      if (dialogReturnData === 'DELETE') {
        this.dataService.deleteDish(id);
        this.toggleViews('default');
      }
    });
  }
}
