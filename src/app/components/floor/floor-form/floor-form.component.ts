import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-floor-form',
  templateUrl: './floor-form.component.html',
  styleUrls: ['./floor-form.component.scss']
})
export class FloorFormComponent implements OnInit {
  floor: any = {id: null};
  houses: Observable<any[]>;
  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.floor.id = params.get('id');
      if (this.floor.id != null) {this.edit(); }
    });
    this.getHouses();
  }

  save() {
    if (this.floor.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('floors', this.floor).subscribe((data: any) => {
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

  update() {
    this.rest.update('floors/' + this.floor.id, this.floor).subscribe((data: any) => {
      this.floor = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) =>  res.result ));
  }
  goBack() {
    this.rest.navigate(['/bxt/floors']);
  }


}
