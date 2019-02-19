import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})
export class DepartmentFormComponent implements OnInit {
  department: any = {id: null};
  colleges: Observable<any[]>;

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.department.id = params.get('id');
      if (this.department.id != null) {this.edit(); }
    });
    this.getColleges();
  }

  save() {
    if (this.department.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('departments', this.department).subscribe((data: any) => {
      this.department = data;
      this.rest.goBlank();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('departments/' + this.department.id).subscribe((data: any) => {
      this.department = data;
    });
  }

  update() {
    this.rest.update('departments/' + this.department.id, this.department).subscribe((data: any) => {
      this.department = data;
      this.rest.goBlank();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  getColleges() {
    this.colleges = this.rest.index('colleges').pipe(map((res: any) =>  res.result ));
  }
}
