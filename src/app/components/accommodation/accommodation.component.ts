import { Component, OnInit } from '@angular/core';
import {RestService} from '../../services/rest.service';
import { MatTableDataSource } from '@angular/material/table';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.scss']
})
export class AccommodationComponent implements OnInit {

  houses: Observable<any[]>;
  floors: Observable<any[]>;
  house: any = {id: null};
  rooms: any = {};
  floor: any = {id: null};
  bed_stats: any = {};

  constructor(private rest: RestService) { }

  ngOnInit() {
    this.getHouse();
  }

  loadFloors() {
    this.rest.index('floors', {house_id: this.house.id, pre: 9999}).subscribe((data: any) => {
      this.floors = data.result;
      this.floor.id = this.floors[0].id;
      this.selectFloor();
    });
  }

  loadRooms( options = {}) {
    this.rest.index('rooms', options).subscribe((data: any) => {
      this.rooms = data.result;
      this.bed_stats = data.bed_stats;
      // this.loadFloors();
    });
  }
  getHouse() {
    this.rest.index('houses', {pre: 999}).subscribe((data: any) => {
      this.houses = data.result;
      this.house.id = this.houses[0].id;
      this.selectHouse();
    });
  }

  getRooms(parent_id) {
    return this.rooms.filter(x => x.parent_id === parent_id);
  }

  selectHouse() {
    const options = {house_id: this.house.id, pre: 9999};
    this.loadFloors();
  }
  selectFloor() {
    const options = {parent_id: this.floor.id, pre: 9999};
    this.loadRooms(options);
  }


}
