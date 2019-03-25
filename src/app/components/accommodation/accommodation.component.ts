import { Component, OnInit } from '@angular/core';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.scss']
})
export class AccommodationComponent implements OnInit {
  houses: any[] = [];
  house: any = {id: null};
  rooms: any = {};

  constructor(private rest: RestService) { }

  ngOnInit() {
    this.loadHouses();
  }

  loadHouses() {
    this.rest.index('houses', {pre: 999}).subscribe((data: any) => {
      this.houses = data.result;
      if (this.houses.length > 0) {
        this.house = this.houses[0];
        this.loadRooms();
      }
    });
  }

  loadRooms() {
    this.rest.index('rooms', {house_id: this.house.id, pre: 9999}).subscribe((data: any) => {
      this.rooms = {};
      for (const room of data.result) {
        console.log(this.rooms[room.floor_mark]);
        if (this.rooms[room.floor_mark] == null) {
          this.rooms[room.floor_mark] = [];
        }
        this.rooms[room.floor_mark].push(room);
      }
    });
  }

  selectHouse() {
    for (const h of this.houses) {
      if (h.id === this.house.id) {
        this.house = h;
        break;
      }
    }
    this.loadRooms();
  }

}
