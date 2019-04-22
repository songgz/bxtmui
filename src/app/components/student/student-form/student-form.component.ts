import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';
import {NgForm} from '@angular/forms';

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
  genders: Observable<any[]>;
  colleges: any[];
  departments: any[];
  classrooms: any[];
  houses: any[];
  rooms: any[];
  beds: any[];
  groups: Observable<any[]>;
  roles: Observable<any[]>;
  avatar64: string | ArrayBuffer = '';
  floors: any[];
  floor_mark = '';

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
    this.rest.index('colleges').subscribe((data: any) => {
      this.colleges = data.result;
    });
  }

  getDepartments() {
    if (this.student.college_id) {
      this.rest.index('departments', {college_id: this.student.college_id}).subscribe((data: any) => {
        this.departments = data.result;
      });
    }
  }

  getClassrooms() {
      this.rest.index('classrooms', {pre: 9999}).subscribe((data: any) => {
        this.classrooms = data.result;
      });
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
    this.rest.index('houses').subscribe((data: any) => {
      this.houses = data.result;
      for ( const h of this.houses ) {
        if ( h.id === this.student.house_id ) {
          this.floors = h.floors;
          break;
        }
      }
    });
  }

  getRooms() {
    this.rest.index('rooms', {pre: 9999}).subscribe((data: any) => {
        this.rooms = data.result;
      });
  }

  filterRooms() {
    this.getRooms();
    this.student.room_id = null;
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
