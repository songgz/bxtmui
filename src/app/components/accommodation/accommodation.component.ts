import { Component, OnInit } from '@angular/core';
import {RestService} from '../../services/rest.service';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.scss']
})
export class AccommodationComponent implements OnInit {

  houses: any[] = [];
  house: any = {id: null};
  rooms: any = {};
  floors: any[] = []


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

  loadFloors() {
    this.rest.index('floors', {house_id: this.house.id, pre: 9999}).subscribe((data: any) => {
      this.floors = data.result;
    });
  }

  loadRooms() {
    this.rest.index('rooms', {house_id: this.house.id, pre: 9999}).subscribe((data: any) => {
      this.rooms = data.result;
      this.loadFloors();
    });
  }

  getRooms(parent_id) {
    return this.rooms.filter(x => x.parent_id === parent_id);
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
