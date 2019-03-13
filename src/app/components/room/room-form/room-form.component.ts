import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DictService} from '../../../services/dict.service';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomFormComponent implements OnInit {
  room: any = {id: null, };

  floors: Observable<any[]>;
  houses: Observable<any[]>;

  constructor(private rest: RestService, private route: ActivatedRoute, private dict: DictService) { }
  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.room.id = params.get('id');
      if (this.room.id != null) {this.edit(); }
    });
    this.getHouses();
    this.floors = this.dict.getItems('floor_level');

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

  goBack() {
    this.rest.navigate(['/bxt/rooms']);
  }


}
