import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DishesModule } from '../dishes/dishes.module';
import { ImportOrderComponent } from './import-order/import-order.component';
import { DashboardComponent } from './dashboard.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrderCreateComponent } from './order-create/order-create.component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardRoutingModule,
    AngularMaterialModule,
    DishesModule
  ],
  declarations: [ImportOrderComponent, DashboardComponent, OrdersListComponent, OrderCreateComponent]
})
export class DashboardModule {}
