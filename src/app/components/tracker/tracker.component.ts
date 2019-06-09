import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import {DictService} from '../../services/dict.service';
import {Observable} from 'rxjs';
import {OrgService} from '../../services/org.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'name', 'sno', 'dept', 'dorm', 'pass_time', 'status', 'overtime'];
  dataSource: MatTableDataSource<any[]>;
  sleep_status: any = {};
  color_status: any = {};
  query: any = {};
  moreserch = false;
  houses: Observable<any[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rest: RestService, private  dict: DictService, private org: OrgService) {
    this.dict.getItems('sleep_status').subscribe(data => {
      for (const item of data) {
        this.sleep_status[item.mark] = item.title;
        this.color_status[item.mark] = item.color;
      }
    });
    this.org.getOrgs();
    this.getHouses();
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.loadTrackers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(event => {
      this.loadTrackers();
    });
  }

  loadTrackers(options = {}) {
    options['page'] = this.paginator.pageIndex + 1;
    options['pre'] = this.paginator.pageSize;
    this.rest.index('trackers', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.paginator.length = data.paginate_meta.total_count;
      this.paginator.pageSize = data.paginate_meta.current_per_page;
      this.paginator.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter() {
    this.loadTrackers(this.query);
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }

}
