import { Component, OnInit } from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';

@Component({
  selector: 'app-manager-form',
  templateUrl: './manager-form.component.html',
  styleUrls: ['./manager-form.component.scss']
})
export class ManagerFormComponent implements OnInit {
  manager: any = {id: null, tel: null, id_card: null, ic_card: null, name: null, gender_mark: null};
  genders: Observable<any[]>;
  roles: Observable<any[]>;
  constructor(private rest: RestService, private route: ActivatedRoute, private  dict: DictService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.manager.id = params.get('id');
      if (this.manager.id != null) {this.edit(); }
    });
    this.genders = this.dict.getItems('gender_type');

  }
  save() {
    if (this.manager.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('managers', this.manager).subscribe((data: any) => {
      this.manager = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('managers/' + this.manager.id).subscribe((data: any) => {
      this.manager = data;

    });
  }

  update() {
    this.rest.update('managers/' + this.manager.id, this.manager).subscribe((data: any) => {
      this.manager = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }





  goBack() {
    this.rest.navigate(['/bxt/managers']);
  }

}
