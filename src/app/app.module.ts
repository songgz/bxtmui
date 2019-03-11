import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MasterComponent } from './layout/master/master.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopnavComponent } from './layout/topnav/topnav.component';
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
import { ErrorComponent } from './components/error/error.component';
import { AlertDialogComponent } from './components/message-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HouseComponent } from './components/house/house.component';
import { HouseFormComponent } from './components/house/house-form/house-form.component';
import { RoomComponent } from './components/room/room.component';
import { RoomFormComponent } from './components/room/room-form/room-form.component';
import { BedComponent } from './components/bed/bed.component';
import { BedFormComponent } from './components/bed/bed-form/bed-form.component';
import { StudentComponent } from './components/student/student.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { ManagerComponent } from './components/manager/manager.component';
import { TrackerComponent } from './components/tracker/tracker.component';
import { StudentFormComponent } from './components/student/student-form/student-form.component';
import { TeacherFormComponent } from './components/teacher/teacher-form/teacher-form.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { MenuItemFormComponent } from './components/menu-item/menu-item-form/menu-item-form.component';
import { GroupComponent } from './components/group/group.component';
import { GroupFormComponent } from './components/group/group-form/group-form.component';
import { RoleComponent } from './components/role/role.component';
import { RoleFormComponent } from './components/role/role-form/role-form.component';
import { DictFormComponent } from './components/dict/dict-form/dict-form.component';
import { DictComponent } from './components/dict/dict.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MasterComponent,
    SidebarComponent,
    TopnavComponent,
    BlankPageComponent,
    DashboardComponent,
    CollegeComponent,
    CollegeFormComponent,
    DepartmentComponent,
    DepartmentFormComponent,
    GradeComponent,
    GradeFormComponent,
    ClassroomComponent,
    ClassroomFormComponent,
    ErrorComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    HouseComponent,
    HouseFormComponent,
    RoomComponent,
    RoomFormComponent,
    BedComponent,
    BedFormComponent,
    StudentComponent,
    TeacherComponent,
    ManagerComponent,
    TrackerComponent,
    StudentFormComponent,
    TeacherFormComponent,
    MenuItemComponent,
    MenuItemFormComponent,
    GroupComponent,
    GroupFormComponent,
    RoleComponent,
    RoleFormComponent,
    DictFormComponent,
    DictComponent
  ],
  entryComponents: [
    AlertDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    HttpClientModule,
    TranslateModule.forRoot(),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
