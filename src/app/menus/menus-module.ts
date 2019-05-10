import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ListMenusComponent } from './list-menus/list-menus.component';
import { MenuCreateComponent } from './menu-create/menu-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material';

@NgModule({
  declarations: [ListMenusComponent, MenuCreateComponent],
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModule, RouterModule]
})
export class MenusModule {}
