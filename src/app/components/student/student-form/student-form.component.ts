import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  student: any = {id: null, department: {id: null, college: {id: null}}, tel: null, id_card: null, ic_card: null};
  colleges: Observable<any[]>;
  departments: Observable<any[]>;
  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.student.id = params.get('id');
      if (this.student.id != null) {this.edit(); }
    });
    this.getColleges();
    this.getDepartments();
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

  getColleges() {
    this.colleges = this.rest.index('colleges').pipe(map((res: any) =>  res.result ));
  }
  getDepartments() {
    if (this.student.department.college.id) {
      this.departments = this.rest.index('departments', {college_id: this.student.department.college.id})
        .pipe(map((res: any) => res.result));
    }
  }

  selectCollege() {
    this.getDepartments();
    this.student.parent_id = null;
  }

  goBack() {
    this.rest.navigate(['/bxt/students']);
  }

}
