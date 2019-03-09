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
  }

  create() {
    this.rest.create('menu_items', this.menuItem).subscribe((data: any) => {
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
    this.rest.update('menu_items/' + this.menuItem.id, this.menuItem).subscribe((data: any) => {
      this.menuItem = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  goBack() {
    this.rest.navigate(['/bxt/menu_items']);
  }

}
