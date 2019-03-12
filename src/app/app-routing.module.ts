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
import {ErrorComponent} from './components/error/error.component';
import {HouseComponent} from './components/house/house.component';
import {HouseFormComponent} from './components/house/house-form/house-form.component';
import {RoomComponent} from './components/room/room.component';
import {RoomFormComponent} from './components/room/room-form/room-form.component';
import {BedComponent} from './components/bed/bed.component';
import {BedFormComponent} from './components/bed/bed-form/bed-form.component';
import {StudentComponent} from './components/student/student.component';
import {StudentFormComponent} from './components/student/student-form/student-form.component';
import {TeacherComponent} from './components/teacher/teacher.component';
import {TeacherFormComponent} from './components/teacher/teacher-form/teacher-form.component';
import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {MenuItemFormComponent} from './components/menu-item/menu-item-form/menu-item-form.component';
import {DictComponent} from './components/dict/dict.component';
import {DictFormComponent} from './components/dict/dict-form/dict-form.component';
import {RoleComponent} from './components/role/role.component';
import {GroupComponent} from './components/group/group.component';
import {GroupFormComponent} from './components/group/group-form/group-form.component';
import {ManagerComponent} from './components/manager/manager.component';
import {ManagerFormComponent} from './components/manager/manager-form/manager-form.component';

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
      {path: 'houses', component: HouseComponent},
      {path: 'houses/new', component: HouseFormComponent},
      {path: 'houses/:id/edit', component: HouseFormComponent},
      {path: 'rooms', component: RoomComponent},
      {path: 'rooms/new', component: RoomFormComponent},
      {path: 'rooms/:id/edit', component: RoomFormComponent},
      {path: 'beds', component: BedComponent},
      {path: 'beds/new', component: BedFormComponent},
      {path: 'beds/:id/edit', component: BedFormComponent},
      {path: 'students', component: StudentComponent},
      {path: 'students/new', component: StudentFormComponent},
      {path: 'students/:id/edit', component: StudentFormComponent},
      {path: 'teachers', component: TeacherComponent},
      {path: 'teachers/new', component: TeacherFormComponent},
      {path: 'teachers/:id/edit', component: TeacherFormComponent},
      {path: 'menu_items', component: MenuItemComponent},
      {path: 'menu_items/new', component: MenuItemFormComponent},
      {path: 'menu_items/:id/edit', component: MenuItemFormComponent},
      {path: 'dicts', component: DictComponent},
      {path: 'dicts/new', component: DictFormComponent},
      {path: 'dicts/:id/edit', component: DictFormComponent},
      {path: 'roles', component: RoleComponent},
      {path: 'roles/new', component: RoomFormComponent},
      {path: 'roles/:id/edit', component: RoomFormComponent},
      {path: 'groups', component: GroupComponent},
      {path: 'groups/new', component: GroupFormComponent},
      {path: 'groups/:id/edit', component: GroupFormComponent},
      {path: 'managers', component: ManagerComponent},
      {path: 'managers/new', component: ManagerFormComponent},
      {path: 'managers/:id/edit', component: ManagerFormComponent},
      {path: 'error', component: ErrorComponent},
      {path: '**', component: BlankPageComponent}
      ]},
  {path: '**', component: BlankPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
