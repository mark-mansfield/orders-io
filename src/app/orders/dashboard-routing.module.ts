import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ImportOrderComponent } from './import-order/import-order.component';
import { DashboardComponent } from './dashboard.component';

const dashboardRoutes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'import-order', component: ImportOrderComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
