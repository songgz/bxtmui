import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-face-access-form',
  templateUrl: './face-access-form.component.html',
  styleUrls: ['./face-access-form.component.scss']
})
export class FaceAccessFormComponent implements OnInit {
  access: any = {};
  direction_types: Observable<any[]>;
  houses = [];

  constructor(private rest: RestService, private route: ActivatedRoute, private  dict: DictService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      if (params.get('id') !== null) {
        this.access.id = params.get('id');
        this.edit();
      }
    });
    this.direction_types = this.dict.getItems('direction_type');
    this.getHouses();
  }

  getHouses() {
    this.rest.index('houses', {pre: 9999}).subscribe((data: any) => {
      this.houses = data.result;
    });
  }

  save() {
    if (this.access.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('face_accesses', {face_access: this.access}).subscribe((data: any) => {
      this.access = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('face_accesses/' + this.access.id).subscribe((data: any) => {
      this.access = data;
    });
  }

  update() {
    this.rest.update('face_accesses/' + this.access.id, {face_access: this.access}).subscribe((data: any) => {
      this.access = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/face-accesses']);
  }

}
