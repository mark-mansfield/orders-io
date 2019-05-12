import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.css']
})
export class DishesComponent implements OnInit {
  dishes = [];
  courses: any = [];
  selectedItem = null;
  disableEditTools: Boolean = true;
  editMode: Boolean = false;
  createMode: Boolean = false;
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
  constructor() {}

  ngOnInit() {
    this.dishes = this.data;
    this.dishes.forEach((item, index) => {
      if (this.courses[index] !== item.course) {
        this.courses.push(item.course);
      }
    });
    this.courses.unshift('all');
    this.courses = new Set(this.courses);
  }

  toggleEditMode() {
    if (!this.editMode) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
    this.createMode = false;
    console.log('toggeling edit mode', this.editMode);
    console.log('create mode : false', this.editMode);
  }

  onSelectCourse(course) {
    if (course === 'all') {
      this.dishes = this.data;
      return;
    }
    this.dishes = [...this.data].filter(function(item) {
      return item.course === course;
    });
  }

  enableEditTools() {
    this.disableEditTools = false;
    this.createMode = false;
  }

  onItemSelect($event) {
    console.log(typeof $event);
    this.selectedItem = $event;

    this.enableEditTools();
  }

  onAddDishClicked() {
    this.editMode = false;
    this.createMode = true;
  }

  saveDish(dish: Object) {
    console.log('saving dish');
    this.toggleEditMode();
  }
}
