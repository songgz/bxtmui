import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss']
})
export class GroupFormComponent implements OnInit {
  group: any = {id: null};

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.group.id = params.get('id');
      if (this.group.id != null) {this.edit(); }
    });
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
