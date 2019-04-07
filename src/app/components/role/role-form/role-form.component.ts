import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FormControl, NgForm} from '@angular/forms';
@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss']
})
export class RoleFormComponent implements OnInit {

  role: any = {id: null};
  groups: Observable<any[]>;
  formControltest = new FormControl();
  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.role.id = params.get('id');
      if (this.role.id != null) {this.edit(); }
    });
    this.getGroups();
  }
  getGroups() {
    this.groups = this.rest.index('groups').pipe(map((res: any) =>  res.result ));
  }
  save(f: NgForm) {
    if (this.role.id != null) {
      this.update(f);
    } else {
      this.create(f);
    }
  }

  create(f: NgForm) {
    this.rest.create('roles', {role: f.value}).subscribe((data: any) => {
      this.role = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('roles/' + this.role.id).subscribe((data: any) => {
      this.role = data;
    });
  }

  update(f: NgForm) {
    this.rest.update('roles/' + this.role.id, {role: f.value}).subscribe((data: any) => {
      this.role = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/roles']);
  }

}
