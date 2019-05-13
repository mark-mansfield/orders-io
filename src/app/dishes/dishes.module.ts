import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material';
import { DishesComponent } from './dishes.component';
import { DishesListComponent } from './dishes-list/dishes-list.component';
import { DishDetailsEditComponent } from './dish-details-edit/dish-details-edit.component';
import { DishCreateComponent } from './dish-create/dish-create.component';
@NgModule({
  imports: [CommonModule, AngularMaterialModule],
  declarations: [DishesListComponent, DishDetailsEditComponent, DishesComponent, DishCreateComponent],
  exports: [DishesListComponent, DishesComponent, DishDetailsEditComponent]
})
export class DishesModule {}
