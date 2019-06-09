import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'title', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;

  query: any = {};
  houses: Observable<any[]>;

  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;

  constructor(private rest: RestService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.loadFloors();
    this.getHouses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFloors();
  }

  loadFloors(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('floors', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }
  applyFilter(filterValue: string = '') {
    filterValue = filterValue.trim();
    if (filterValue.length !== 0) {
      this.query['key'] = filterValue;
    }
    this.loadFloors(this.query);
  }

  public update (id: string)  {
    this.rest.navigate(['/bxt/floors/', id, 'edit']);
  }

  public delete (id: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('floors/' + id).subscribe(data => {
          this.loadFloors();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }
}
