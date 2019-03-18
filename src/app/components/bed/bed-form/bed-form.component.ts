import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-bed-form',
  templateUrl: './bed-form.component.html',
  styleUrls: ['./bed-form.component.scss']
})
export class BedFormComponent implements OnInit {
  bed: any = {id: null, user_id: null, parent_id: null, room: {id: null, floor: null, house: {id: null}}};
  houses: Observable<any[]>;
  rooms: Observable<any[]>;
  students: Observable<any[]>;

  constructor(private rest: RestService, private route: ActivatedRoute, private dict: DictService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.bed.id = params.get('id');
      if (this.bed.id != null) {this.edit(); }
    });
    this.getHouses();
    this.getRooms();
    this.getStudents();
  }
  save(f: NgForm) {
    if (this.bed.id != null) {
      this.update(f);
    } else {
      this.create(f);
    }
  }

  create(f: NgForm) {
    this.rest.create('beds', {bed: f.value}).subscribe((data: any) => {
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
      this.getStudents();
    });
  }

  update(f: NgForm) {
    this.rest.update('beds/' + this.bed.id, {bed: f.value}).subscribe((data: any) => {
      this.bed = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) =>  res.result ));
  }

  getRooms() {
    if (this.bed.room.parent_id) {
      this.rooms = this.rest.index('rooms', {parent_id: this.bed.room.parent_id})
        .pipe(map((res: any) => res.result));
    }
  }

  getStudents() {
    if (this.bed.parent_id) {
      this.students = this.rest.index('students', {room_id: this.bed.parent_id})
        .pipe(map((res: any) => res.result));
    }
  }

  filterRooms() {
    this.getRooms();
    this.bed.parent_id = null;
  }

  filterStudents() {
    this.getStudents();
    this.bed.user_id = null;
  }

  goBack() {
    this.rest.navigate(['/bxt/beds']);
  }

}
