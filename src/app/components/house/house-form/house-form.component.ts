import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-house-form',
  templateUrl: './house-form.component.html',
  styleUrls: ['./house-form.component.scss']
})
export class HouseFormComponent implements OnInit {
  house: any = {id: null};

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.house.id = params.get('id');
      if (this.house.id != null) {this.edit(); }
    });
  }

  save() {
    if (this.house.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('houses', this.house).subscribe((data: any) => {
      this.house = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('houses/' + this.house.id).subscribe((data: any) => {
      this.house = data;
    });
  }

  update() {
    this.rest.update('houses/' + this.house.id, this.house).subscribe((data: any) => {
      this.house = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/houses']);
  }

}
