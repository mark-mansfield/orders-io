import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DishesComponent } from './dishes.component';
import { DishesListComponent } from './dishes-list/dishes-list.component';
@NgModule({
  imports: [CommonModule, AngularMaterialModule, ReactiveFormsModule, FormsModule],
  declarations: [DishesComponent, DishesListComponent],
  exports: [DishesComponent, DishesListComponent]
})
export class DishesModule {}
