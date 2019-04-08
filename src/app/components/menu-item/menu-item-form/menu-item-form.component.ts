import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';

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
    console.log(data1);
    this.menuItem.depth = data1.depth + 1;
    this.menuItem.parent_id = data1.id;
  }

  save() {
    if (this.menuItem.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('menu_items', {menu_item: this.menuItem}).subscribe((data: any) => {
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

  update() {
    this.rest.update('menu_items/' + this.menuItem.id, {menu_item: this.menuItem}).subscribe((data: any) => {
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
