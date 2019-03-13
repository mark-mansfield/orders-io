import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ImportOrderComponent } from './import-order/import-order.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule],
  declarations: [ImportOrderComponent, DashboardComponent]
})
export class DashboardModule {}
