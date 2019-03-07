import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
export interface Gender {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  student: any = {id: null,
                  classroom: {id: null,
                              department: {id: null,
                                          college: {id: null}
                                          }
                             },
                  bed: {id: null,
                        room: {id: null,
                                floor: {id: null,
                                        house: {id: null}
                                        }
                              }
                        },
                  tel: null,
                  id_card: null,
                  ic_card: null,
                  gender: null};
  genders: Gender[] = [
    {value: '男', viewValue: '男'},
    {value: '女', viewValue: '女'}
  ];
  colleges: Observable<any[]>;
  departments: Observable<any[]>;
  classrooms: Observable<any[]>;


  houses: Observable<any[]>;
  floors: Observable<any[]>;
  rooms: Observable<any[]>;
  beds: Observable<any[]>;


  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.student.id = params.get('id');
      if (this.student.id != null) {this.edit(); }
    });
    this.getColleges();
    this.getDepartments();
    this.getClassrooms();

    this.getHouses();
    this.getFloors();
    this.getRooms();
    this.getBeds();


  }
  getColleges() {
    this.colleges = this.rest.index('colleges').pipe(map((res: any) =>  res.result ));
  }
  getDepartments() {
    if (this.student.classroom.department.college.id) {
      this.departments = this.rest.index('departments', {college_id: this.student.classroom.department.college.id})
        .pipe(map((res: any) => res.result));
    }
  }
  getClassrooms() {
    if (this.student.classroom.department.id) {
      this.classrooms = this.rest.index('classrooms', {college_id: this.student.classroom.department.id})
        .pipe(map((res: any) => res.result));
    }
  }
  selectCollege() {
    this.getDepartments();
    this.student.classroom.department.id = null;
  }
  selectDepartment() {
    this.getClassrooms();
    this.student.classroom.id = null;
  }

  getHouses() {
      this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));

  }
  getFloors() {
    if (this.student.bed.room.floor.house.id) {
      this.floors = this.rest.index('floors', {house_id: this.student.bed.room.floor.house.id})
        .pipe(map((res: any) => res.result));
    }
  }
  getRooms() {
    if (this.student.bed.room.floor.id) {
      this.rooms = this.rest.index('rooms', {floor_id: this.student.bed.room.floor.id})
        .pipe(map((res: any) => res.result));
    }
  }
  getBeds() {
    if (this.student.bed.room.id) {
      this.beds = this.rest.index('beds', {room_id: this.student.bed.room.id})
        .pipe(map((res: any) => res.result));
    }
  }
  selectHouse() {
    this.getFloors();
    this.student.bed.room.floor.id = null;
  }
  selectFloor() {
    this.getRooms();
    this.student.bed.room.id = null;
  }
  selectRoom() {
    this.getBeds();
    this.student.bed.id = null;
  }



  save() {
    if (this.student.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('students', this.student).subscribe((data: any) => {
      this.student = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('students/' + this.student.id).subscribe((data: any) => {
      this.student = data;
      console.log(data);
      this.getDepartments();
      this.getClassrooms();
      this.getHouses();
      this.getFloors();
      this.getRooms();
      this.getBeds();
    });
  }

  update() {
    this.rest.update('students/' + this.student.id, this.student).subscribe((data: any) => {
      this.student = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }


  goBack() {
    this.rest.navigate(['/bxt/students']);
  }

}
