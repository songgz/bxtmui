import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MasterComponent} from './layout/master/master.component';
import { BlankPageComponent } from './components/blank-page/blank-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CollegeComponent } from './components/college/college.component';
import { CollegeFormComponent } from './components/college/college-form/college-form.component';
import { DepartmentComponent } from './components/department/department.component';
import { DepartmentFormComponent } from './components/department/department-form/department-form.component';
import { GradeComponent } from './components/grade/grade.component';
import { GradeFormComponent } from './components/grade/grade-form/grade-form.component';
import { ClassroomComponent } from './components/classroom/classroom.component';
import { ClassroomFormComponent } from './components/classroom/classroom-form/classroom-form.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'bxt', component: MasterComponent, children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'colleges', component: CollegeComponent},
      {path: 'colleges/:id/edit', component: CollegeFormComponent},
      {path: 'colleges/new', component: CollegeFormComponent},
      {path: 'departments', component: DepartmentComponent},
      {path: 'departments/new', component: DepartmentFormComponent},
      {path: 'departments/:id/edit', component: DepartmentFormComponent},
      {path: 'grades', component: GradeComponent},
      {path: 'grades/new', component: GradeFormComponent},
      {path: 'grades/:id/edit', component: GradeFormComponent},
      {path: 'classrooms', component: ClassroomComponent},
      {path: 'classrooms/new', component: ClassroomFormComponent},
      {path: 'classrooms/:id/edit', component: ClassroomFormComponent},
      {path: '**', component: BlankPageComponent}
      ]},
  {path: '**', component: BlankPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
