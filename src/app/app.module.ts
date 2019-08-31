import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

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
import { ClassroomComponent } from './components/classroom/classroom.component';
import { ClassroomFormComponent } from './components/classroom/classroom-form/classroom-form.component';
import { ErrorComponent } from './components/error/error.component';
import { AlertDialogComponent } from './components/message-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { HouseComponent } from './components/house/house.component';
import { HouseFormComponent } from './components/house/house-form/house-form.component';
import { HouseShowComponent } from './components/house/house-show/house-show.component';
import { RoomComponent } from './components/room/room.component';
import { RoomFormComponent } from './components/room/room-form/room-form.component';
import { StudentComponent, ImgDialogStudentComponent, ListDialogStudentComponent } from './components/student/student.component';
import { TeacherComponent, ImgDialogTeacherComponent } from './components/teacher/teacher.component';
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
import { ManagerFormComponent } from './components/manager/manager-form/manager-form.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { LatecomerComponent } from './components/latecomer/latecomer.component';
import { AccessComponent } from './components/access/access.component';
import { GateComponent } from './components/gate/gate.component';
import { GateLogComponent } from './components/gate-log/gate-log.component';
import { WebcamComponent } from './components/webcam/webcam.component';
import { RoomBoxComponent } from './components/room-box/room-box.component';
import { AccommodationComponent } from './components/accommodation/accommodation.component';
import { IncomingComponent } from './components/incoming/incoming.component';
import { MenuAccessComponent } from './components/menu-access/menu-access.component';
import { UpfileComponent } from './components/upfile/upfile.component';
import { SetdormComponent } from './components/setdorm/setdorm.component';
import { AccessFormComponent } from './components/access/access-form/access-form.component';
import { VideoRecorderComponent } from './components/video-recorder/video-recorder.component';
import { GateFormComponent } from './components/gate/gate-form/gate-form.component';
import { WebcamFormComponent } from './components/webcam/webcam-form/webcam-form.component';
import { FloorComponent } from './components/floor/floor.component';
import { FloorFormComponent } from './components/floor/floor-form/floor-form.component';
import { FigurecardComponent } from './components/figurecard/figurecard.component';
import { VideoRecorderFormComponent } from './components/video-recorder/video-recorder-form/video-recorder-form.component';
import { ExchangesComponent } from './components/exchanges/exchanges.component';
import { IncomingFormComponent } from './components/incoming/incoming-form/incoming-form.component';
import { PasswordDialogComponent } from './components/password-dialog/password-dialog.component';
import {JwtInterceptor} from './interceptors/jwt-interceptor';
import { FaceComponent } from './components/face/face.component';
import { HouseAccessComponent } from './components/house-access/house-access.component';
import { StudentViewComponent } from './components/accommodation/student-view/student-view.component';
import { PersonDialogComponent } from './components/person-dialog/person-dialog.component';
import { ImportAvatarComponent } from './components/import-avatar/import-avatar.component';
import { ImportStudentComponent } from './components/import-student/import-student.component';
import {CommonModule} from '@angular/common';
import { HolidayComponent } from './components/holiday/holiday.component';


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
    ClassroomComponent,
    ClassroomFormComponent,
    ErrorComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    HouseComponent,
    HouseFormComponent,
    HouseShowComponent,
    RoomComponent,
    RoomFormComponent,
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
    DictComponent,
    ManagerFormComponent,
    AttendanceComponent,
    LatecomerComponent,
    AccessComponent,
    GateComponent,
    GateLogComponent,
    WebcamComponent,
    RoomBoxComponent,
    AccommodationComponent,
    IncomingComponent,
    MenuAccessComponent,
    ImgDialogStudentComponent,
    ListDialogStudentComponent,
    ImgDialogTeacherComponent,
    UpfileComponent,
    SetdormComponent,
    AccessFormComponent,
    VideoRecorderComponent,
    GateFormComponent,
    WebcamFormComponent,
    FloorComponent,
    FloorFormComponent,
    FigurecardComponent,
    VideoRecorderFormComponent,
    ExchangesComponent,
    IncomingFormComponent,
    PasswordDialogComponent,
    FaceComponent,
    HouseAccessComponent,
    StudentViewComponent,
    PersonDialogComponent,
    ImportAvatarComponent,
    ImportStudentComponent,
    HolidayComponent,

  ],
  entryComponents: [
    ImgDialogStudentComponent,
    ListDialogStudentComponent,
    ImgDialogTeacherComponent,
    AlertDialogComponent,
    ConfirmDialogComponent,
    PasswordDialogComponent,
    PersonDialogComponent,
    ImportStudentComponent,
    ImportAvatarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    HttpClientModule,
    TranslateModule.forRoot(),
    FormsModule,
    FileUploadModule,
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
