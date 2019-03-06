import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit {
  teacher: any = {id: null, department: {id: null, college: {id: null}}, tel: null, id_card: null, ic_card: null};
  colleges: Observable<any[]>;
  departments: Observable<any[]>;

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.teacher.id = params.get('id');
      if (this.teacher.id != null) {this.edit(); }
    });
    this.getColleges();
    this.getDepartments();
  }
  save() {
    if (this.teacher.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('teachers', this.teacher).subscribe((data: any) => {
      this.teacher = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('teachers/' + this.teacher.id).subscribe((data: any) => {
      this.teacher = data;
      this.getDepartments();

    });
  }

  update() {
    this.rest.update('teachers/' + this.teacher.id, this.teacher).subscribe((data: any) => {
      this.teacher = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  getColleges() {
    this.colleges = this.rest.index('colleges').pipe(map((res: any) =>  res.result ));
  }
  getDepartments() {
    if (this.teacher.department.id) {
      this.departments = this.rest.index('departments', {college_id: this.teacher.department.id})
        .pipe(map((res: any) => res.result));
    }
  }

  selectCollege() {
    this.getDepartments();
    this.teacher.parent_id = null;
  }

  goBack() {
    this.rest.navigate(['/bxt/teachers']);
  }

}
