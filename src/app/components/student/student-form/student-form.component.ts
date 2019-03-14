import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';
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
                  org_id: null,
                  classroom: {id: null,
                              department: {id: null,
                                          college: {id: null}
                                          }
                             },
                  room: {id: null, house: {id: null} },
                  facility_id: null,
                  tel: null,
                  id_card: null,
                  ic_card: null,
                  gender_mark: null};
  genders: Observable<any[]>;
  colleges: Observable<any[]>;
  departments: Observable<any[]>;
  classrooms: Observable<any[]>;
  houses: Observable<any[]>;
  rooms: Observable<any[]>;
  beds: Observable<any[]>;


  constructor(private rest: RestService, private route: ActivatedRoute, private  dict: DictService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.student.id = params.get('id');
      if (this.student.id != null) {this.edit(); }
    });
    this.getColleges();
    this.getDepartments();
    this.getClassrooms();

    this.getHouses();
    this.genders = this.dict.getItems('gender_type');
    this.getRooms();
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
      this.classrooms = this.rest.index('classrooms', {department_id: this.student.classroom.department.id})
        .pipe(map((res: any) => res.result));
    }
  }
  selectCollege() {
    this.getDepartments();
    this.student.classroom.department.id = null;
  }

  selectDepartment() {
    this.getClassrooms();
    this.student.org_id = null;
  }

  getHouses() {
      this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }

  getRooms() {
    if (this.student.room.house.id) {
      this.rooms = this.rest.index('rooms', {house_id: this.student.room.house.id})
        .pipe(map((res: any) => res.result));
    }
  }

  filterRooms() {
    this.getRooms();
    this.student.facility_id = null;
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
      this.getDepartments();
      this.getClassrooms();
      this.getHouses();
      this.getRooms();
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
