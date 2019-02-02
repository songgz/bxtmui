import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MasterComponent} from './layout/master/master.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'bxt', component: MasterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
