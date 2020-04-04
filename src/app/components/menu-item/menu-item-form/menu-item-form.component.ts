import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-menu-item-form',
  templateUrl: './menu-item-form.component.html',
  styleUrls: ['./menu-item-form.component.scss']
})
export class MenuItemFormComponent implements OnInit {
  menuItem: any = {id: null};

  constructor(private rest: RestService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      this.menuItem.id = params.get('id');
      if (this.menuItem.id != null) {this.edit(); }
    });
    const data1 = JSON.parse(sessionStorage.getItem('key'));
    this.menuItem.depth = data1.depth;
    this.menuItem.parent_id = data1.id;
    this.menuItem.parent_title = data1.title;
  }

  save(f: NgForm) {
    if (this.menuItem.id != null) {
      this.update(f);
    } else {
      this.create(f);
    }
  }

  create(f: NgForm) {
    this.rest.create('menu_items', {menu_item: f.value}).subscribe((data: any) => {
      this.menuItem = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('menu_items/' + this.menuItem.id).subscribe((data: any) => {
      this.menuItem = data;
    });
  }

  update(f: NgForm) {
    this.rest.update('menu_items/' + this.menuItem.id, {menu_item: f.value}).subscribe((data: any) => {
      this.menuItem = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/menu_items']);
  }
  depth() {
  }

}
