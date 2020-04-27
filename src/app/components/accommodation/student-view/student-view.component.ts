import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import {OrgService} from '../../../services/org.service';
import {environment} from '../../../../environments/environment';
import {ImgDialogStudentComponent, ListDialogStudentComponent} from '../../student/student.component';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.scss']
})
export class StudentViewComponent implements OnInit {
  disabled: boolean = true;
  readOnly: boolean = true;
  student: any = { };
  genders: Observable<any[]>;
  directions: Observable<any[]>;
  floors: any[];
  rooms: any[];
  groups: Observable<any[]>;
  roles: Observable<any[]>;
  imgsrc: any = '/assets/img/imghead.png';

  constructor(private rest: RestService,
              private route: ActivatedRoute,
              private  dict: DictService,
              public org: OrgService,
              public dialog: MatDialog
              ) {
  }

  ngOnInit() {
    this.org.getOrgs();
    this.route.paramMap.subscribe((params: any) => {
      this.student.id = params.get('id');
      if (this.student.id != null) {
        this.view();
      }
    });
    this.genders = this.dict.getItems('gender_type');
    this.directions = this.dict.getItems('direction_type');
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

  view() {
    this.rest.show('students/' + this.student.id).subscribe((data: any) => {
      this.student = data;
      this.getRooms();
      this.inspection( data );
    });
  }
  inspection( data:any ) {
    
      // 判断图片是否存在
      const ImgObj = new Image();
      ImgObj.src = environment.baseUrl + this.student.avatar_url;
      if ( data.avatar_url != null && (ImgObj.width > 0 && ImgObj.height > 0) ) {
        this.imgsrc = environment.baseUrl + this.student.avatar_url;
      } else {
        this.imgsrc = '/assets/img/imghead.png';
      }
    
  }
  // ngAfterViewInit() {
  //   this.inspection( );
  // }
  openDialog() {
    this.dialog.open(ImgDialogStudentComponent, {
      data: {
        dataid: this.imgsrc
      }
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/accommodations']);
  }
}
