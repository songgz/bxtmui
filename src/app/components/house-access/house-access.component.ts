import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import {DictService} from '../../services/dict.service';
import {Observable} from 'rxjs';



@Component({
  selector: 'app-house-access',
  templateUrl: './house-access.component.html',
  styleUrls: ['./house-access.component.scss']
})
export class HouseAccessComponent implements OnInit {

  displayedColumns = ['title', 'action'];
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
    this.dict.getItems('menu_privilege').subscribe((data => {
      this.menu_privileges = data;
      this.loadRoles();
      this.loadPermissions();
      this.loadHouses();
    }));
  }

  loadHouses() {
    this.rest.index('houses').subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
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

  getPermission(aco_id, aro_id) {
    for (const perm of this.permissions) {
      if (perm.aco_id === aco_id && perm.aro_id === aro_id) {
        return perm;
      }
    }
    return {aco_id: aco_id, aco_type: 'MenuItem', aro_id: aro_id, operations: []};
  }

  onChangePrivilege(aco_id, aro_id, operation) {
    const perm = this.getPermission(aco_id, aro_id);
    const index = perm.operations.indexOf(operation);
    if (index > -1) {
      perm.operations.splice(index, 1);
    } else {
      perm.operations.push(operation);
    }

    if (perm.id === undefined && perm.operations.length > 0 ) {
      this.rest.create('permissions', {permission: perm}).subscribe((data: any) => {
        this.permissions.push(data);
      }, error => {
        this.rest.errorHandle(error);
      });
    }

    if (perm.id != null && perm.operations.length === 0) {
      this.permissions.splice(this.permissions.indexOf(perm), 1);
      this.rest.destory('permissions/' + perm.id).subscribe(data => {
      }, error => {
        this.rest.errorHandle(error);
      });
    }

    if (perm.id != null && perm.operations.length > 0) {
      this.rest.update('permissions/' + perm.id, {permission: perm}).subscribe((data: any) => {
      }, error => {
        this.rest.errorHandle(error);
      });
    }

  }

}
