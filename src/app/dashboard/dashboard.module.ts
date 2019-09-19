import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material';
// import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter, MatNativeDateModule } from '@angular/material';
import { MatNativeDateModule } from '@angular/material';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DishesModule } from '../dishes/dishes.module';
import { SharedModule } from '../shared-module/shared-module.module';
import { ImportOrderComponent } from './import-order/import-order.component';
import { DashboardComponent } from './dashboard.component';
import { OrdersListComponent } from './orders-list/orders-list.component';

import { OrderCreateComponent } from './order-create/order-create.component';
// import { MomentDateAdapter, MOMENT_DATE_FORMATS } from '../custom-date-adaptor/date-adaptor';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    AngularMaterialModule,
    DishesModule,
    SharedModule,
    MatNativeDateModule
  ],
  declarations: [ImportOrderComponent, DashboardComponent, OrdersListComponent, OrderCreateComponent],
  providers: [
    // { provide: MAT_DATE_LOCALE, useValue: 'en-au' },
    // { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
    // { provide: DateAdapter, useClass: MomentDateAdapter }
  ]
})
export class DashboardModule { }
