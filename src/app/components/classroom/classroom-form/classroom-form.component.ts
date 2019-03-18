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
  departments: any[] = [];

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
    this.rest.create('classrooms', {classroom: this.classroom}).subscribe((data: any) => {
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
    this.rest.update('classrooms/' + this.classroom.id, {classroom: this.classroom}).subscribe((data: any) => {
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
      this.rest.index('departments', {college_id: this.classroom.department.college.id})
        .pipe(map((res: any) => res.result)).subscribe(departments => {
        this.departments = departments;
      });
    }
  }

  selectCollege() {
    this.getDepartments();
    this.classroom.parent_id = null;
  }

  selectDepartment() {
    for ( const d of this.departments) {
        if ( d.id === this.classroom.parent_id) {
          this.classroom.department = d;
          break;
        }
    }
  }

  goBack() {
    this.rest.navigate(['/bxt/classrooms']);
  }

}
