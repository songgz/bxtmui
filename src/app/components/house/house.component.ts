import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss']
})
export class HouseComponent implements OnInit, AfterViewInit {
  query: any = {};
  houses: Observable<any[]>;
  displayedColumns = [ 'title', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;


  constructor(private rest: RestService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.getHouses();
    // this.loadHouse();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadHouse(this.query );
  }

  loadHouse(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('houses', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.dataSource.sort = this.sort;
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter() {
    this.loadHouse(this.query);
  }

  public update (id: string)  {
    this.rest.navigate(['/bxt/houses/', id, 'edit']);
  }
  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }
  public delete (id: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('houses/' + id).subscribe(data => {
          this.loadHouse();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }
}
