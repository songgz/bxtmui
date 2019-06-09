import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {DictService} from '../../services/dict.service';
import {OrgService} from '../../services/org.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-latecomer',
  templateUrl: './latecomer.component.html',
  styleUrls: ['./latecomer.component.scss']
})
export class LatecomerComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'user_name', 'user_sno', 'dept_title', 'dorm_title', 'pass_time', 'status',  'overtime', 'action' ];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;
  query: any = {};
  sleep_status: any = {};
  color_status: any = {};
  houses: Observable<any[]>;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;

  constructor(private rest: RestService, private  dict: DictService, private org: OrgService) {
    this.dataSource = new MatTableDataSource([]);
    this.dict.getItems('sleep_status').subscribe(data => {
      for (const item of data) {
        this.sleep_status[item.mark] = item.title;
        this.color_status[item.mark] = item.color;
      }
    });
    this.org.getOrgs();
    this.getHouses();
  }

  ngOnInit() {
    this.loadLatecomers();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLatecomers();
  }
  applyFilter() {
    this.loadLatecomers(this.query);
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }

  loadLatecomers(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('latecomers', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    });
  }

  public update (id: string)  {
    this.rest.navigate(['/bxt/latecomers/', id, 'edit']);
  }

}
