import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';
import {NgForm} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit {
  teacher: any = {};
  departments: Observable<any[]>;
  genders: Observable<any[]>;
  groups: Observable<any[]>;
  roles: Observable<any[]>;
  avatar64: string | ArrayBuffer = '';
  imgsrc: any = '/assets/img/imghead.png';

  constructor(private rest: RestService, private route: ActivatedRoute, private  dict: DictService, private sanitizer: DomSanitizer ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.teacher.id = params.get('id');
      if (this.teacher.id != null) {this.edit(); }
    });
    this.getDepartments();
    this.genders = this.dict.getItems('gender_type');
    this.getGroups();
    this.getRoles();
  }

  getGroups() {
    this.groups = this.rest.index('groups').pipe(map((res: any) =>  res.result ));
  }
  getRoles() {
    this.roles = this.rest.index('roles').pipe(map((res: any) =>  res.result ));
  }
  save(f: NgForm) {
    f.value['avatar'] = this.avatar64;
    if (this.teacher.id != null) {
      this.update(f);
    } else {
      this.create(f);
    }
  }

  create(f: NgForm) {
    this.rest.create('teachers', this.teacher ).subscribe((data: any) => {
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
      this.imgsrc = environment.baseUrl + this.teacher.avatar_url;

    });
  }

  update(f: NgForm) {
    this.rest.update('teachers/' + this.teacher.id, {teacher: f.value}).subscribe((data: any) => {
      this.teacher = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  getDepartments() {
      this.departments = this.rest.index('departments')
        .pipe(map((res: any) => res.result));
  }

  goBack() {
    this.rest.navigate(['/bxt/teachers']);
  }

  getAvatar(event) {
    const file = event.target.files[0];
    this.imgsrc = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        this.avatar64 = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

}
