import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  group: any = {id: null};
  roles: Observable<any[]>;
  formControltest = new FormControl();
  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.group.id = params.get('id');
      if (this.group.id != null) {this.edit(); }
    });
    this.getRoles();
  }
  getRoles() {
    this.roles = this.rest.index('roles').pipe(map((res: any) =>  res.result ));
  }
  save() {
    if (this.group.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('groups', this.group).subscribe((data: any) => {
      this.group = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('groups/' + this.group.id).subscribe((data: any) => {
      this.group = data;
    });
  }

  update() {
    this.rest.update('groups/' + this.group.id, this.group).subscribe((data: any) => {
      this.group = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/groups']);
  }

}
