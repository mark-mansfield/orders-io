import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../../models/dish.model';

@Component({
  selector: 'app-dish-create',
  templateUrl: './dish-create.component.html',
  styleUrls: ['./dish-create.component.css']
})
export class DishCreateComponent implements OnInit {
  form: FormGroup;
  dish: Dish;
  submitted: boolean;
  constructor(private formBuilder: FormBuilder) {}

  @Input() courses: any;

  ngOnInit() {
    this.submitted = false;

    this.form = this.formBuilder.group({
      dishName: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]],
      description: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]],
      portion_sizes: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]],
      course: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9 .]*')]]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSaveDish() {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form);
      console.log('form is invalid');
      // return;
    }
    console.log(this.form);

    // this.dish = {
    //   name: this.form.dishName.value,
    //   description: this.form.description.value,
    //   portion_sizes: this.portion_sizes.value.split(' '),
    //   course: this.form.course.value,
    //   id: null
    // };
    // this.orderService.createOrder(this.order);
    // this.form.reset();
    // this.navigateBack();
    // console.log(this.order); // this.form.reset();
  }
}
