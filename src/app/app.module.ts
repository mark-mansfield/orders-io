import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';




import { DashboardModule } from './dashboard/dashboard.module';
import { DishesModule } from './dishes/dishes.module';
import { MenusModule } from './menus/menus.module';
import { SharedModule } from './shared-module/shared-module.module';

// TODO:  rename this to login-signup
// import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './auth/login/login.component';

import { DialogsComponent } from './dialogs/dialogs.component';
import { OrdersFilterComponent } from './dashboard/orders-filter/orders-filter.component';
import { FiltersDialogComponent } from './dialogs/filters-dialog/filters-dialog.component';
import { DeleteItemComponent } from './dialogs/delete-item/delete-item.component';
import { AddItemDialogComponent } from './dialogs/add-item-dialog/add-item-dialog.component';
import { ResponsiveLayoutComponent } from './responsive-layout/responsive-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    // WelcomeComponent,
    LoginComponent,
    DialogsComponent,
    OrdersFilterComponent,
    FiltersDialogComponent,
    DeleteItemComponent,
    AddItemDialogComponent,
    ResponsiveLayoutComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularMaterialModule,
    // MenusModule,
    DashboardModule,
    DishesModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, DialogsComponent, DeleteItemComponent, AddItemDialogComponent]
})
export class AppModule { }
