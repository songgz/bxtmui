import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';
import {NgForm} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {isDate} from 'rxjs/internal-compatibility';

export interface Grade {
  title: string;
  mark: string;
}
export interface Floor {
  title: string;
  mark: string;
}

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  student: any = {
    id: null,
    org_id: null,
    college: {id: null},
    department: {id: null},
    classroom: {id: null},
    room: {id: null},
    house: {id: null},
    facility_id: null,
    tel: null,
    id_card: null,
    ic_card: null,
    gender_mark: null
  };
  grades: Grade[] = [
    {title: '大一', mark: '01'},
    {title: '大二', mark: '02'},
    {title: '大三', mark: '03'}
  ];
  floors: Floor[] = [
    {title: '一层', mark: '01'},
    {title: '二层', mark: '02'},
    {title: '三层', mark: '03'}
  ];
  genders: Observable<any[]>;
  colleges: Observable<any[]>;
  departments: Observable<any[]>;
  classrooms: Observable<any[]>;
  houses: Observable<any[]>;
  rooms: Observable<any[]>;
  beds: Observable<any[]>;
  groups: Observable<any[]>;
  roles: Observable<any[]>;
  avatar64: string | ArrayBuffer = '';

  constructor(private rest: RestService, private route: ActivatedRoute, private  dict: DictService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.student.id = params.get('id');
      if (this.student.id != null) {
        this.edit();
      }
    });
    this.getColleges();
    this.getDepartments();
    this.getClassrooms();

    this.getHouses();
    this.genders = this.dict.getItems('gender_type');
    this.getRooms();
    this.getGroups();
    this.getRoles();
  }
  getGroups() {
    this.groups = this.rest.index('groups').pipe(map((res: any) =>  res.result ));
  }
  getRoles() {
    this.roles = this.rest.index('roles').pipe(map((res: any) =>  res.result ));
  }
  getColleges() {
    this.colleges = this.rest.index('colleges').pipe(map((res: any) => res.result));
  }

  getDepartments() {
    if (this.student.college_id) {
      this.departments = this.rest.index('departments', {college_id: this.student.college_id})
        .pipe(map((res: any) => res.result));
    }
  }

  getClassrooms() {
    if (this.student.department_id) {
      this.classrooms = this.rest.index('classrooms', {department_id: this.student.department_id})
        .pipe(map((res: any) => res.result));
    }
  }

  selectCollege() {
    this.getDepartments();
    this.student.department_id = null;
  }

  selectDepartment() {
    this.getClassrooms();
    this.student.classroom_id = null;
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }

  getRooms() {
    if (this.student.house_id) {
      this.rooms = this.rest.index('rooms', {house_id: this.student.house_id})
        .pipe(map((res: any) => res.result));
    }
  }



  save(f: NgForm) {
    f.value['avatar'] = this.avatar64;
    if (this.student.id != null) {
      this.update(f);
    } else {
      this.create(f);
    }
  }

  create(f: NgForm) {
    this.rest.create('students', {student: f.value}).subscribe((data: any) => {
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

  update(f: NgForm) {
    this.rest.update('students/' + this.student.id, {student: f.value}).subscribe((data: any) => {
      this.student = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }


  goBack() {
    this.rest.navigate(['/bxt/students']);
  }

  getAvatar(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        this.avatar64 = reader.result;
      };
      reader.readAsDataURL(file);
    }

  }


}
