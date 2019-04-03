import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-menu-access',
  templateUrl: './menu-access.component.html',
  styleUrls: ['./menu-access.component.scss']
})
export class MenuAccessComponent implements OnInit {
  displayedColumns = ['title', 'path', 'action'];
  dataSource: MatTableDataSource<any[]>;
  roles: any[] = [];
  permissions: any[] = [];

  constructor(private rest: RestService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
    this.loadMenuItems();
  }

  loadMenuItems() {
    this.rest.index('menu_items').subscribe((data: any) => {
      this.dataSource = data;
    });
  }

  loadRoles() {
    this.rest.index('roles').subscribe((data: any) => {
      this.roles = data;
    });
  }

  loadPermissions() {
    this.rest.index('permissions').subscribe((data: any) => {
      this.permissions = data;
    });
  }


}
