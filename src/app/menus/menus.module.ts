import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenusRoutingModule } from './menus-routing.module';
import { MenusComponent } from './menus.component';
import { ListMenusComponent } from './list-menus/list-menus.component';
import { MenuCreateComponent } from './menu-create/menu-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material';

@NgModule({
  declarations: [ListMenusComponent, MenuCreateComponent, MenusComponent],
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModule, RouterModule, MenusRoutingModule]
})
export class MenusModule {}
