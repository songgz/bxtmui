import { Component, OnInit } from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-grade-form',
  templateUrl: './grade-form.component.html',
  styleUrls: ['./grade-form.component.scss']
})
export class GradeFormComponent implements OnInit {
  grade: any = {id: null, department: {id: null, college: {id: null}}};
  colleges: Observable<any[]>;
  departments: Observable<any[]>;

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.grade.id = params.get('id');
      if (this.grade.id != null) {this.edit(); }
    });

    this.getColleges();
    this.getDepartments();
  }

  save() {
    if (this.grade.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('grades', this.grade).subscribe((data: any) => {
      this.grade = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('grades/' + this.grade.id).subscribe((data: any) => {
      this.grade = data;
      this.getDepartments();
    });
  }

  update() {
    this.rest.update('grades/' + this.grade.id, this.grade).subscribe((data: any) => {
      this.grade = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  getColleges() {
    this.colleges = this.rest.index('colleges').pipe(map((res: any) =>  res.result ));
  }

  getDepartments() {
    if (this.grade.department.college.id) {
      this.departments = this.rest.index('departments', {college_id: this.grade.department.college.id}).pipe(map((res: any) => res.result));
    }
  }

  selectCollege() {
    this.getDepartments();
    this.grade.parent_id = null;
  }

  goBack() {
    this.rest.navigate(['/bxt/grades']);
  }

}
