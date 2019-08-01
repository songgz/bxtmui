import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';
import {NgForm} from '@angular/forms';
import {environment} from "../../../../environments/environment";
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-manager-form',
  templateUrl: './manager-form.component.html',
  styleUrls: ['./manager-form.component.scss']
})
export class ManagerFormComponent implements OnInit {
  manager: any = { };
  genders: Observable<any[]>;
  groups: Observable<any[]>;
  roles: Observable<any[]>;
  avatar64: string | ArrayBuffer = '';
  imgsrc: any = '/assets/img/imghead.png';

  constructor(
    private rest: RestService,
    private route: ActivatedRoute,
    private  dict: DictService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.manager.id = params.get('id');
      if (this.manager.id != null) {this.edit(); }
    });
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
    if (this.manager.id != null) {
      this.update(f);
    } else {
      this.create(f);
    }
  }

  create(f: NgForm) {
    this.rest.create('managers', {manager: f.value}).subscribe((data: any) => {
      this.manager = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('managers/' + this.manager.id).subscribe((data: any) => {
      this.manager = data;

    });
  }

  update(f: NgForm) {
    this.rest.update('managers/' + this.manager.id, {manager: f.value}).subscribe((data: any) => {
      this.manager = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }


  inspection() {
    this.rest.show('managers/' + this.manager.id).subscribe((data: any) => {
      // 判断图片是否存在
      const ImgObj = new Image();
      ImgObj.src = environment.baseUrl + this.manager.avatar_url;
      if ( data.avatar_url != null && (ImgObj.width > 0 && ImgObj.height > 0) ) {
        this.imgsrc = environment.baseUrl + this.manager.avatar_url;
      } else {
        this.imgsrc = '/assets/img/imghead.png';
      }
    });
  }
  ngAfterViewInit() {
    this.inspection();
  }

  goBack() {
    this.rest.navigate(['/bxt/managers']);
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
