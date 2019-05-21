import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListMenusComponent } from './menus/list-menus/list-menus.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './auth/auth-guard';
import { DishesComponent } from './dishes/dishes.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
  { path: 'menus', loadChildren: './menus/menus.module#MenusModule' },
  { path: 'list-dishes', component: DishesComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth-module#AuthModule' }
];

// , { enableTracing: true }
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
