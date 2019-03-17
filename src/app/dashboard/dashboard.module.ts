import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ImportOrderComponent } from './import-order/import-order.component';
import { DashboardComponent } from './dashboard.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DashboardRoutingModule, AngularMaterialModule],
  declarations: [ImportOrderComponent, DashboardComponent, OrdersListComponent]
})
export class DashboardModule {}
