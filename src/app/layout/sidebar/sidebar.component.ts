import { Component, OnInit } from '@angular/core';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public showMenu: string;
  public menuItems: any[] = [];

  constructor(private rest: RestService) {
    this.loadMenuItems();
  }

  ngOnInit() {
    this.showMenu = '';
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  loadMenuItems() {
    this.rest.index('menu_items').subscribe((data: any) => {
      this.menuItems = data;
    });
  }

  findChildren(menuItemId) {
    const items = [];
    for (const item of this.menuItems) {
      if (item.parent_id === menuItemId) {
        items.push(item);
      }
    }
    return items;
  }

  hasChild(menuItemId) {
    for (const item of this.menuItems) {
      if (item.parent_id === menuItemId) {
        return true;
      }
    }
    return false;
  }
}
