import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuCreateComponent } from './menus/menu-create/menu-create.component';
import { ListMenusComponent } from './menus/list-menus/list-menus.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './auth/auth-guard';
import { DishesComponent } from './dishes/dishes.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
  { path: 'edit/:id', component: MenuCreateComponent, canActivate: [AuthGuard] },
  { path: 'list-menus', component: ListMenusComponent, canActivate: [AuthGuard] },
  { path: 'list-dishes', component: DishesComponent, canActivate: [AuthGuard] },
  { path: 'menu-create', component: MenuCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth-module#AuthModule' }
];

// , { enableTracing: true }
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
