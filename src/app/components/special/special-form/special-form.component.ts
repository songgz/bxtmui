import {Component, OnInit, AfterViewInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';
import {NgForm} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {OrgService} from '../../../services/org.service';
import {Location} from '@angular/common';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-special-form',
  templateUrl: './special-form.component.html',
  styleUrls: ['./special-form.component.scss']
})
export class SpecialFormComponent implements OnInit {
  student: any = { };
  houses: any[];
  houseId: any;
  floors: any[];
  rooms: any[];
  room: any;
  beds: any[];
  genders: Observable<any[]>;
  groups: Observable<any[]>;
  roles: Observable<any[]>;
  avatar64: string | ArrayBuffer = '';
  imgsrc: any = '/assets/img/imghead.png';
  readonlyvalue = true;
  disabledvalue = true;

  constructor(private rest: RestService,
    private route: ActivatedRoute,
    private  dict: DictService,
    public org: OrgService,
    private sanitizer: DomSanitizer,
    private location: Location) {
}


  ngOnInit(): void {
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
    this.getHouses();
  }
  getGroups() {
    this.groups = this.rest.index('groups').pipe(map((res: any) =>  res.result ));
  }

  getRoles() {
    this.roles = this.rest.index('roles').pipe(map((res: any) =>  res.result ));
  }

  getHouses() {
    this.rest.index('houses', {pre: 9999}).subscribe((data: any) => {
      this.houses = data.result;
    });
  }

  getFloors() {
    this.rest.index('floors', {pre: 9999}).subscribe((data: any) => {
      this.floors = data.result;
    });
  }

  getRooms() {
    this.rest.index('rooms', {pre: 9999, parent_id: this.student.dorm_parent_id}).subscribe((data: any) => {
      this.rooms = data.result;
      this.room = this.rooms.find( roomData => roomData.id === this.student.dorm_id);
      this.beds = this.room.beds;
    });
  }


  selectFloor() {
    this.getRooms();
  }
  selectRoom(e: any) {
    this.room = this.rooms.find( roomData => roomData.id === e);
    this.beds = this.room.beds;
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
    });
  }



  update(f: NgForm) {
    // console.log("update");
    this.rest.update('students/' + this.student.id, {student: f.value}).subscribe((data: any) => {
      console.log( 'update:' + data);
      this.student = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  PostHouse() {
    console.log(this.houseId);
    this.rest.create('cards', {  card: { user_id: this.student.id , house_id: this.houseId}  }).subscribe((data: any) => {
      console.log('user_id:', this.student.id);
      console.log('house_id:', this.houseId);
    }, error => {
      this.rest.errorHandle(error);
    });
  }


  goBack() {
    // this.location.back();
    this.rest.navigate(['/bxt/special']);
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
