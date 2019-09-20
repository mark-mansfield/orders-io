import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppDashboardRoutingModule } from './app-dashboard-routing.module';
import { UniversalDashboardComponent } from './universal-dashboard/universal-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    AppDashboardRoutingModule
  ],
  declarations: [UniversalDashboardComponent]
})
export class AppDashboardModule { }
