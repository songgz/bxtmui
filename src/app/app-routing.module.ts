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
import { ClassroomComponent } from './components/classroom/classroom.component';
import { ClassroomFormComponent } from './components/classroom/classroom-form/classroom-form.component';
import {ErrorComponent} from './components/error/error.component';
import {HouseComponent} from './components/house/house.component';
import {HouseFormComponent} from './components/house/house-form/house-form.component';
import {RoomComponent} from './components/room/room.component';
import {RoomFormComponent} from './components/room/room-form/room-form.component';
import {StudentComponent} from './components/student/student.component';
import {StudentFormComponent} from './components/student/student-form/student-form.component';
import {TeacherComponent} from './components/teacher/teacher.component';
import {TeacherFormComponent} from './components/teacher/teacher-form/teacher-form.component';
import {MenuItemComponent} from './components/menu-item/menu-item.component';
import {MenuItemFormComponent} from './components/menu-item/menu-item-form/menu-item-form.component';
import {DictComponent} from './components/dict/dict.component';
import {DictFormComponent} from './components/dict/dict-form/dict-form.component';
import {RoleComponent} from './components/role/role.component';
import {RoleFormComponent} from './components/role/role-form/role-form.component';
import {GroupComponent} from './components/group/group.component';
import {GroupFormComponent} from './components/group/group-form/group-form.component';
import {ManagerComponent} from './components/manager/manager.component';
import {ManagerFormComponent} from './components/manager/manager-form/manager-form.component';
import {AttendanceComponent} from './components/attendance/attendance.component';
import {AccessComponent} from './components/access/access.component';
import {WebcamComponent} from './components/webcam/webcam.component';
import {GateComponent} from './components/gate/gate.component';
import {GateLogComponent} from './components/gate-log/gate-log.component';
import {VideoRecorderComponent} from './components/video-recorder/video-recorder.component';
import {LatecomerComponent} from './components/latecomer/latecomer.component';
import {HouseShowComponent} from './components/house/house-show/house-show.component';
import {AccommodationComponent} from './components/accommodation/accommodation.component';
import {StudentViewComponent} from './components/accommodation/student-view/student-view.component';
import {TrackerComponent} from './components/tracker/tracker.component';
import {IncomingComponent} from './components/incoming/incoming.component';
import {MenuAccessComponent} from './components/menu-access/menu-access.component';
import {UpfileComponent} from './components/upfile/upfile.component';
import {SetdormComponent} from './components/setdorm/setdorm.component';
import {AccessFormComponent} from './components/access/access-form/access-form.component';
import {GateFormComponent} from './components/gate/gate-form/gate-form.component';
import {WebcamFormComponent} from './components/webcam/webcam-form/webcam-form.component';
import {FloorComponent} from './components/floor/floor.component';
import {FloorFormComponent} from './components/floor/floor-form/floor-form.component';
import {VideoRecorderFormComponent} from './components/video-recorder/video-recorder-form/video-recorder-form.component';
import {ExchangesComponent} from './components/exchanges/exchanges.component';
import {IncomingFormComponent} from './components/incoming/incoming-form/incoming-form.component';
import {AuthGuardService} from './services/auth-guard.service';
import {HouseAccessComponent} from './components/house-access/house-access.component';
import {HolidayComponent} from './components/holiday/holiday.component';
import {HomingComponent} from './components/homing/homing.component';
import {FaceComponent} from './components/face/face.component';
import {UpdateComponent} from './components/update/update.component';
import {CardAccessComponent} from './components/card-access/card-access.component';
import {CardAccessFormComponent} from './components/card-access/card-access-form/card-access-form.component';
import {CardComponent} from './components/card/card.component';
import {FaceAccessComponent} from './components/face-access/face-access.component';
import {FaceAccessFormComponent} from './components/face-access/face-access-form/face-access-form.component';
import {SpecialComponent} from './components/special/special.component';
import {SpecialFormComponent} from './components/special/special-form/special-form.component';
import {ChatComponent} from './components/chat/chat.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'login/:username/:password', component: LoginComponent},
  {path: 'bxt', component: MasterComponent, children: [
      {path: 'dashboards', component: DashboardComponent, canActivate: [AuthGuardService]},
      {path: '', component: DashboardComponent, canActivate: [AuthGuardService]},
      {path: 'colleges', component: CollegeComponent, canActivate: [AuthGuardService]},
      {path: 'colleges/:id/edit', component: CollegeFormComponent},
      {path: 'colleges/new', component: CollegeFormComponent},
      {path: 'departments', component: DepartmentComponent},
      {path: 'departments/new', component: DepartmentFormComponent},
      {path: 'departments/:id/edit', component: DepartmentFormComponent},
      {path: 'classrooms', component: ClassroomComponent},
      {path: 'classrooms/new', component: ClassroomFormComponent},
      {path: 'classrooms/:id/edit', component: ClassroomFormComponent},
      {path: 'house-access', component: HouseAccessComponent},
      {path: 'houses', component: HouseComponent},
      {path: 'houses/new', component: HouseFormComponent},
      {path: 'houses/:id/edit', component: HouseFormComponent},
      {path: 'houses/:id', component: HouseShowComponent},
      {path: 'faces', component: FaceComponent},
      {path: 'floors', component: FloorComponent},
      {path: 'floors/new', component: FloorFormComponent},
      {path: 'floors/:id/edit', component: FloorFormComponent},
      {path: 'rooms', component: RoomComponent},
      {path: 'rooms/new', component: RoomFormComponent},
      {path: 'rooms/:id/edit', component: RoomFormComponent},
      {path: 'students', component: StudentComponent},
      {path: 'students', component: UpfileComponent},
      {path: 'students/new', component: StudentFormComponent},
      {path: 'students/:id/edit', component: StudentFormComponent},
      {path: 'teachers', component: TeacherComponent},
      {path: 'teachers', component: UpfileComponent},
      {path: 'teachers/new', component: TeacherFormComponent},
      {path: 'teachers/:id/edit', component: TeacherFormComponent},
      {path: 'menu_items', component: MenuItemComponent},
      {path: 'menu_items/new', component: MenuItemFormComponent},
      {path: 'menu_items/:id/edit', component: MenuItemFormComponent},
      {path: 'dicts', component: DictComponent},
      {path: 'dicts/new', component: DictFormComponent},
      {path: 'dicts/:id/edit', component: DictFormComponent},
      {path: 'roles', component: RoleComponent},
      {path: 'roles/new', component: RoleFormComponent},
      {path: 'roles/:id/edit', component: RoleFormComponent},
      {path: 'groups', component: GroupComponent},
      {path: 'groups/new', component: GroupFormComponent},
      {path: 'groups/:id/edit', component: GroupFormComponent},
      {path: 'menu-accesses', component: MenuAccessComponent},
      {path: 'house-accesses', component: HouseAccessComponent},
      {path: 'managers', component: ManagerComponent},
      {path: 'managers/new', component: ManagerFormComponent},
      {path: 'managers/:id/edit', component: ManagerFormComponent},
      {path: 'accesses', component: AccessComponent},
      {path: 'accesses/new', component: AccessFormComponent},
      {path: 'accesses/:id/edit', component: AccessFormComponent},
      {path: 'update', component: UpdateComponent},
      {path: 'chats', component: ChatComponent},
      {path: 'card-accesses', component: CardAccessComponent},
      {path: 'card-accesses/new', component: CardAccessFormComponent},
      {path: 'card-accesses/:id/edit', component: CardAccessFormComponent},
      {path: 'face-accesses', component: FaceAccessComponent},
      {path: 'face-accesses/new', component: FaceAccessFormComponent},
      {path: 'face-accesses/:id/edit', component: FaceAccessFormComponent},
      {path: 'cards', component: CardComponent},

      {path: 'accommodations', component: AccommodationComponent},
      {path: 'accommodations/:id/view', component: StudentViewComponent},
      {path: 'homings', component: HomingComponent},
      {path: 'incomings', component: IncomingComponent},
      {path: 'incomings/:id/edit', component: IncomingFormComponent},
      {path: 'latecomers', component: LatecomerComponent},
      {path: 'attendances', component: AttendanceComponent},
      {path: 'holidays', component: HolidayComponent},
      {path: 'trackers', component: TrackerComponent},
      {path: 'webcams', component: WebcamComponent},
      {path: 'webcams/new', component: WebcamFormComponent},
      {path: 'webcams/:id/edit', component: WebcamFormComponent},
      {path: 'gates', component: GateComponent},
      {path: 'gates/new', component: GateFormComponent},
      {path: 'gates/:id/edit', component: GateFormComponent},
      {path: 'gate-logs', component: GateLogComponent},
      {path: 'video-recorders', component: VideoRecorderComponent},
      {path: 'video-recorders/new', component: VideoRecorderFormComponent},
      {path: 'video-recorders/:id/edit', component: VideoRecorderFormComponent},
      {path: 'setdorms', component: SetdormComponent },
      {path: 'exchanges', component: ExchangesComponent},
      {path: 'special', component: SpecialComponent},
      {path: 'special/:id/edit', component: SpecialFormComponent},
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
