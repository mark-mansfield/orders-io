import { NgModule } from '@angular/core';
import { CommonModule } from '../../../node_modules/@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularMaterialModule } from '../angular-material';
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing-module';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule {



}
