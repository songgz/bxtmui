import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';

@Component({
  selector: 'app-bed-form',
  templateUrl: './bed-form.component.html',
  styleUrls: ['./bed-form.component.scss']
})
export class BedFormComponent implements OnInit {

  bed: any = {id: null, room: {id: null, floor: null, house: {id: null}}};
  houses: Observable<any[]>;
  floors: Observable<any[]>;
  rooms: Observable<any[]>;

  constructor(private rest: RestService, private route: ActivatedRoute, private dict: DictService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.bed.id = params.get('id');
      if (this.bed.id != null) {this.edit(); }
    });
    this.floors = this.dict.getItems('floor_level');
    this.getHouses();
    this.getRooms();
  }
  save() {
    if (this.bed.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('beds', this.bed).subscribe((data: any) => {
      this.bed = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('beds/' + this.bed.id).subscribe((data: any) => {
      this.bed = data;
      this.getRooms();
    });
  }

  update() {
    this.rest.update('beds/' + this.bed.id, this.bed).subscribe((data: any) => {
      this.bed = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) =>  res.result ));
  }

  getFloors() {
    if (this.bed.room.floor.house.id) {
      this.floors = this.rest.index('floors', {house_id: this.bed.room.floor.house.id})
        .pipe(map((res: any) => res.result));
    }
  }
  getRooms() {
    if (this.bed.room.floor && this.bed.room.house.id) {
      this.rooms = this.rest.index('rooms', {floor: this.bed.room.floor, parent_id: this.bed.room.house.id})
        .pipe(map((res: any) => res.result));
    }
  }

  filteRooms() {
    this.getRooms();
  }

  selectHouse() {
    this.getFloors();
    this.bed.parent_id = null;
  }
  selectFloor() {
    this.getRooms();
    this.bed.parent_id = null;
  }

  goBack() {
    this.rest.navigate(['/bxt/beds']);
  }

}
