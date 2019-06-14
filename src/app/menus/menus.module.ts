import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenusRoutingModule } from './menus-routing.module';
import { MenusComponent } from './menus.component';
import { ListMenusComponent } from './list-menus/list-menus.component';
import { SharedModule } from '../shared-module/shared-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material';

@NgModule({
  declarations: [ListMenusComponent, MenusComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule,
    MenusRoutingModule,
    SharedModule
  ]
})
export class MenusModule {}
