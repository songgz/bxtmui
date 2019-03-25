import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-house-show',
  templateUrl: './house-show.component.html',
  styleUrls: ['./house-show.component.scss']
})
export class HouseShowComponent implements OnInit {
  house: any = {};
  rooms: any = {};

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.house.id = params.get('id');
      if (this.house.id != null) {this.show(); }
    });
  }

  show() {
    this.rest.show('houses/' + this.house.id).subscribe((data: any) => {
      this.house = data;
      this.getRooms();
    });
  }

  getRooms() {
    this.rest.index('rooms', {house_id: this.house.id, pre: 9999}).subscribe((data: any) => {
      for (const room of data.result) {
        console.log(this.rooms[room.floor_mark]);
        if (this.rooms[room.floor_mark] == null) {
          this.rooms[room.floor_mark] = [];
        }
        this.rooms[room.floor_mark].push(room);
      }
    });
  }



}
