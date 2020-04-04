import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'title', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;

  constructor(private rest: RestService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.loadRoles();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRoles();
  }
  loadRoles(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('roles', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  applyFilter(filterValue: string) {
    this.loadRoles({key: filterValue.trim()});
  }
  update (id: string)  {
    this.rest.navigate(['/bxt/roles/', id, 'edit']);
  }

  delete (id: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('roles/' + id).subscribe(data => {
          this.loadRoles();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }

}
