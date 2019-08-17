import { Component, OnInit, AfterViewInit } from '@angular/core';
import {environment} from '../../../environments/environment';
import {RestService} from '../../services/rest.service';
import {DictService} from '../../services/dict.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-person-dialog',
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.scss']
})
export class PersonDialogComponent implements OnInit, AfterViewInit {
  manager: any = { };
  imgsrc: any = '/assets/img/imghead.png';
  user_id = '';
  data: any = {};
  genders: Observable<any[]>;
  groups: Observable<any[]>;
  roles: Observable<any[]>;
  constructor(private rest: RestService,
              private  dict: DictService
  ) {
    this.user_id = localStorage.getItem('user_id');
  }

  ngOnInit() {
    this.manager.id = this.user_id;
    if (this.manager.id != null) { this.edit();
    } else {
      alert('请先登录');
    }
    this.genders = this.dict.getItems('gender_type');
    this.getGroups();
    this.getRoles();
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
  getGroups() {
    this.groups = this.rest.index('groups').pipe(map((res: any) =>  res.result ));
  }

  getRoles() {
    this.roles = this.rest.index('roles').pipe(map((res: any) =>  res.result ));
  }
  edit() {
    this.rest.show('managers/' + this.manager.id).subscribe((data: any) => {
      this.manager = data;

    });
  }

  ngAfterViewInit() {
    this.inspection();
  }
}
