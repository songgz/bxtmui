import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomFormComponent implements OnInit {
  room: any = {id: null, floor: {id: null, house: {id: null}}};
  floors: Observable<any[]>;
  houses: Observable<any[]>;
  constructor(private rest: RestService, private route: ActivatedRoute) { }
  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.room.id = params.get('id');
      if (this.room.id != null) {this.edit(); }
    });
    this.getHouses();
    this.getFloors();
  }
  save() {
    if (this.room.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('rooms', this.room).subscribe((data: any) => {
      this.room = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('rooms/' + this.room.id).subscribe((data: any) => {
      this.room = data;
      this.getFloors();
    });
  }

  update() {
    this.rest.update('rooms/' + this.room.id, this.room).subscribe((data: any) => {
      this.room = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) =>  res.result ));
  }
  getFloors() {
    if (this.room.floor.house.id) {
      this.floors = this.rest.index('floors', {house_id: this.room.floor.house.id})
        .pipe(map((res: any) => res.result));
    }
  }
  selectHouse() {
    this.getFloors();
    this.room.parent_id = null;
  }
  goBack() {
    this.rest.navigate(['/bxt/rooms']);
  }


}
