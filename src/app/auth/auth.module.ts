import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './routes';

@NgModule({
  imports: [SharedModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  declarations: [LoginComponent, SignupComponent],
})
export class AuthModule {}
