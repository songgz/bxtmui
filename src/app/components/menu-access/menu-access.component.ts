import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {RestService} from '../../services/rest.service';
import {DictService} from '../../services/dict.service';
import {Observable} from 'rxjs';

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
  role: any = {id: null};
  menu_privileges: Observable<any[]>;
  tests: any[] = ['aa', 'bb'];

  constructor(private rest: RestService, private dict: DictService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.menu_privileges = this.dict.getItems('menu_privilege');
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
      this.roles = data.result;
      if (this.roles.length > 0) {
        this.role = this.roles[0];
      }
    });
  }

  loadPermissions() {
    this.rest.index('permissions').subscribe((data: any) => {
      this.permissions = data.result;
    });
  }

  getPermit(aco_id, aro_id, operation) {
    for (const perm of this.permissions) {
      if (perm.aco_id === aco_id && perm.aro_id === aro_id) {
        return perm.operations.inddexOf(operation) > 0;
      }
    }
    return false;
  }


}
