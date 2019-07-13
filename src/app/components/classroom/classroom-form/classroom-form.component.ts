import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import {OrgService} from '../../../services/org.service';

@Component({
  selector: 'app-classroom-form',
  templateUrl: './classroom-form.component.html',
  styleUrls: ['./classroom-form.component.scss']
})
export class ClassroomFormComponent implements OnInit {
  classroom: any = {id: null, department: {id: null, college: {id: null}}};

  constructor(private rest: RestService, private route: ActivatedRoute, public org: OrgService) {
    this.org.getDepartments();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.classroom.id = params.get('id');
      if (this.classroom.id != null) {this.edit(); }
    });
  }

  save(f: NgForm) {
    if (this.classroom.id != null) {
      this.update(f);
    } else {
      this.create(f);
    }
  }

  create(f: NgForm) {
    this.rest.create('classrooms', {classroom: f.value}).subscribe((data: any) => {
      this.classroom = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('classrooms/' + this.classroom.id).subscribe((data: any) => {
      this.classroom = data;
    });
  }

  update(f: NgForm) {
    this.rest.update('classrooms/' + this.classroom.id, {classroom: f.value}).subscribe((data: any) => {
      this.classroom = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/classrooms']);
  }

}
