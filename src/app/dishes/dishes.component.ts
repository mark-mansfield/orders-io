import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {
  form: FormGroup;
  dishes = [];
  courses: any = [];
  selectedItem = null;

  mode: string;
  inputDisabled: Boolean = true;

  disableEditTools: Boolean = false;
  editMode: Boolean = false;
  createMode: Boolean = false;
  submitted: Boolean = false;

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
      description: 'Jerusalem artichokes, bay, lemon, olives, eschallots , dates (Legs and thighs- 18 pieces)',
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
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
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
        [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]
      ],
      course: [{ value: '', disabled: this.inputDisabled }, [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]]
    });

    this.dishes = this.data;
    this.dishes.forEach((item, index) => {
      if (this.courses[index] !== item.course) {
        this.courses.push(item.course);
      }
    });
    this.courses.unshift('all');
    this.courses = new Set(this.courses);
  }

  // toggleEditMode() {
  //   if (!this.editMode) {
  //     this.editMode = true;
  //   } else {
  //     this.editMode = false;
  //   }
  //   this.createMode = false;
  //   console.log('toggeling edit mode', this.editMode);
  //   console.log('create mode : false', this.editMode);
  // }

  updateFormMode(mode) {
    if (mode === 'create') {
      this.mode = mode;
      this.selectedItem = {};
      this.form.controls.dishName.reset({ value: this.selectedItem.name, disabled: false });
      this.form.controls.description.reset({ value: this.selectedItem.description, disabled: false });
      this.form.controls.portion_sizes.reset({ value: this.selectedItem.portion_sizes, disabled: false });
      this.form.controls.course.reset({ value: this.selectedItem.course, disabled: false });
    }
    if (mode === 'edit') {
      this.inputDisabled = false;
      this.mode = mode;
      this.form.controls.dishName.reset({ value: this.selectedItem.name, disabled: false });
      this.form.controls.description.reset({ value: this.selectedItem.description, disabled: false });
      this.form.controls.portion_sizes.reset({ value: this.selectedItem.portion_sizes, disabled: false });
      this.form.controls.course.reset({ value: this.selectedItem.course, disabled: false });
    }
    if (mode === 'view') {
      this.form.controls.dishName.reset({ value: this.selectedItem.name, disabled: true });
      this.form.controls.description.reset({ value: this.selectedItem.description, disabled: true });
      this.form.controls.portion_sizes.reset({ value: this.selectedItem.portion_sizes, disabled: true });
      this.form.controls.course.reset({ value: this.selectedItem.course, disabled: true });
      this.inputDisabled = true;
    }

    this.mode = mode;
    console.log(this.mode);
  }

  // onSelectMode(mode) {
  //   this.mode = mode;
  // }

  onFilterByCourse(course) {
    if (course === 'all') {
      this.dishes = this.data;
      return;
    }
    this.dishes = [...this.data].filter(function(item) {
      return item.course === course;
    });
  }

  onSelectCourse(course) {
    this.form.controls.course.reset({ value: course, disabled: false });
  }

  toggleEditTools() {
    this.disableEditTools = false;
    this.createMode = false;
  }

  onItemSelect($event) {
    this.selectedItem = $event;
    this.updateFormMode('view');
    this.toggleEditTools();
  }

  // onAddDishClicked() {
  //   this.selectedItem = null;
  //   this.editMode = false;
  //   this.createMode = true;
  //   this.updateMode(mode)
  //   console.log(this.mode);
  // }

  saveDish(dish: Object) {
    console.log('saving dish');
    // this.toggleEditMode();
  }
}
