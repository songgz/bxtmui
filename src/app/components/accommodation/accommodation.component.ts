import { Component, OnInit } from '@angular/core';
import {RestService} from '../../services/rest.service';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.scss']
})
export class AccommodationComponent implements OnInit {
  displayedColumns: string[] = ['title', 'date', 'action'];
  dataSource: any;
  houses: any[] = [];
  house: any = {id: null};
  rooms: any = {};
  days: any[] = [
    {title: '国庆节', date: '2019-10-01'},
    {title: '劳动节', date: '2019-05-01'},
    {title: '儿童节', date: '2019-06-01'},
  ];

  constructor(private rest: RestService) {
    this.dataSource = new MatTableDataSource(this.days);
  }

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
  add(name: string , date: string, data2: string): void {
    this.days.push({title: name, date: date, date2: data2});
    this.dataSource = new MatTableDataSource(this.days);
  }
  delete (i: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        console.log(i);
        console.log(this.days);
        this.days.splice(1 , 1);
        this.dataSource = new MatTableDataSource(this.days);
      }
    });
  }

}
