import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import {DictService} from '../../services/dict.service';

@Component({
  selector: 'app-card-access',
  templateUrl: './card-access.component.html',
  styleUrls: ['./card-access.component.scss']
})
export class CardAccessComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'title', 'ip', 'direction', 'status', 'action'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;
  direction_types = {};
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;

  constructor(private rest: RestService, private dict: DictService) {
    this.dataSource = new MatTableDataSource([]);
    this.dict.getItemMap('direction_type').subscribe(data => {
      this.direction_types = data;
    });
  }

  ngOnInit() {
    this.loadAccess();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAccess();
  }
  loadAccess(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('card-accesses', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  update (id: string)  {
    this.rest.navigate(['/bxt/card-accesses/', id, 'edit']);
  }
  delete (id: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('card-accesses/' + id).subscribe(data => {
          this.loadAccess();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }
  applyFilter(filterValue: string) {
    this.loadAccess({key: filterValue.trim()});
  }
}

