import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {DictService} from '../../../services/dict.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrls: ['./room-form.component.scss']
})
export class RoomFormComponent implements OnInit {
  room: any = {id: null, floor_mark: null, parent_id: null};
  houses: any[] = [];
  house: any = {};

  constructor(private rest: RestService, private route: ActivatedRoute, private dict: DictService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.room.id = params.get('id');
      if (this.room.id != null) {this.edit(); }
    });
    this.getHouses();
  }
  save(f: NgForm) {
    if (this.room.id != null) {
      this.update(f);
    } else {
      this.create(f);
    }
  }

  create(f: NgForm) {
    this.rest.create('rooms', {room: f.value}).subscribe((data: any) => {
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

  update(f: NgForm) {
    this.rest.update('rooms/' + this.room.id, {room: f.value}).subscribe((data: any) => {
      this.room = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  getHouses() {
    this.rest.index('houses').pipe(map((res: any) =>  res.result )).subscribe(data => {
      this.houses = data;
    });
  }

  selectHouse() {
    for ( const h of this.houses) {
      if (h.id === this.room.parent_id) {
        this.room.house = h;
      }
    }
    this.room.floor_mark = null;
  }

  goBack() {
    this.rest.navigate(['/bxt/rooms']);
  }
  newadd() {
    this.room.beds.push({ title: null, mark: null});
  }

  ThisDel(i) {
    this.room.beds.splice(i, 1 );
  }


}
