import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';
import {NgForm} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {OrgService} from '../../../services/org.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  student: any = { };
  genders: Observable<any[]>;
  floors: any[];
  rooms: any[];
  groups: Observable<any[]>;
  roles: Observable<any[]>;
  avatar64: string | ArrayBuffer = '';
  imgsrc: any = '/assets/img/imghead.png';

  constructor(private rest: RestService,
              private route: ActivatedRoute,
              private  dict: DictService,
              private org: OrgService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.org.getOrgs();
    this.route.paramMap.subscribe((params: any) => {
      this.student.id = params.get('id');
      if (this.student.id != null) {
        this.edit();
      }
    });
    this.genders = this.dict.getItems('gender_type');
    this.getGroups();
    this.getRoles();
    this.getFloors();
  }

  getGroups() {
    this.groups = this.rest.index('groups').pipe(map((res: any) =>  res.result ));
  }

  getRoles() {
    this.roles = this.rest.index('roles').pipe(map((res: any) =>  res.result ));
  }

  getFloors() {
    this.rest.index('floors', {pre: 9999}).subscribe((data: any) => {
      this.floors = data.result;
    });
  }

  getRooms() {
    this.rest.index('rooms', {pre: 9999, parent_id: this.student.dorm_parent_id}).subscribe((data: any) => {
        this.rooms = data.result;
      });
  }

  selectFloor() {
    this.getRooms();
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
      this.getRooms();
      // 判断图片是否存在
      const ImgObj = new Image();
      ImgObj.src = environment.baseUrl + this.student.avatar_url;
      if ( data.avatar_url != null && (ImgObj.width > 0 && ImgObj.height > 0) ) {
        this.imgsrc = environment.baseUrl + this.student.avatar_url;
      } else {
        this.imgsrc = '/assets/img/imghead.png';
      }
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
