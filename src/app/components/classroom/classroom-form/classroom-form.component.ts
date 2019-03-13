import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-classroom-form',
  templateUrl: './classroom-form.component.html',
  styleUrls: ['./classroom-form.component.scss']
})
export class ClassroomFormComponent implements OnInit {
  classroom: any = {id: null, department: {id: null, college: {id: null}}};
  colleges: Observable<any[]>;
  departments: Observable<any[]>;

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.classroom.id = params.get('id');
      if (this.classroom.id != null) {this.edit(); }
    });
    this.getColleges();
    this.getDepartments();
  }

  save() {
    if (this.classroom.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('classrooms', this.classroom).subscribe((data: any) => {
      this.classroom = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('classrooms/' + this.classroom.id).subscribe((data: any) => {
      this.classroom = data;
      this.getDepartments();
    });
  }

  update() {
    this.rest.update('classrooms/' + this.classroom.id, this.classroom).subscribe((data: any) => {
      this.classroom = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  getColleges() {
    this.colleges = this.rest.index('colleges').pipe(map((res: any) =>  res.result ));
  }

  getDepartments() {
    if (this.classroom.department.college.id) {
      this.departments = this.rest.index('departments', {college_id: this.classroom.department.college.id})
        .pipe(map((res: any) => res.result));
    }
  }

  selectCollege() {
    this.getDepartments();
    this.classroom.parent_id = null;
  }

  goBack() {
    this.rest.navigate(['/bxt/classrooms']);
  }

}
