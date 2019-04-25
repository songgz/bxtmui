import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-floor-form',
  templateUrl: './floor-form.component.html',
  styleUrls: ['./floor-form.component.scss']
})
export class FloorFormComponent implements OnInit {
  floor: any = {id: null};
  houses: any[] = [];

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getHouses();
    this.route.paramMap.subscribe((params: any) => {
      this.floor.id = params.get('id');
      if (this.floor.id != null) {this.edit(); }
    });
  }

  save(f: NgForm) {
    if (this.floor.id != null) {
      this.update(f);
    } else {
      this.create(f);
    }
  }

  create(f: NgForm) {
    this.rest.create('floors', {floor: f.value}).subscribe((data: any) => {
      this.floor = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('floors/' + this.floor.id).subscribe((data: any) => {
      this.floor = data;
    });
  }

  update(f: NgForm) {
    this.rest.update('floors/' + this.floor.id, {floor: f.value}).subscribe((data: any) => {
      this.floor = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/floors']);
  }

  getHouses() {
    this.rest.index('houses').subscribe((data: any) => {
      this.houses = data.result;
    });
  }

}
