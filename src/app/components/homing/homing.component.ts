import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {map} from 'rxjs/operators';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Observable} from 'rxjs';
import {OrgService} from '../../services/org.service';
import {DictService} from '../../services/dict.service';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-homing',
  templateUrl: './homing.component.html',
  styleUrls: ['./homing.component.scss']
})
export class HomingComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'name', 'sno', 'dorm_title', 'pass_time', 'direction'];
  dataSource: MatTableDataSource<any[]>;
  query: any = {};
  moreserch = false;
  genders: Observable<any[]>
  houses: Observable<any[]>;
  sleep_status: any = {};
  color_status: any = {};
  color_direction: any = {};
  status_stats: any = {};
  baseUrl: any;
  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  progressbar = 0;
  direction_type: any = {};

  constructor(
    private rest: RestService,
    private  dict: DictService,
    public org: OrgService,
    public dialog: MatDialog) {
    this.dict.getItems('sleep_status').subscribe(data => {
      for (const item of data) {
        this.sleep_status[item.mark] = item.title;
        this.color_status[item.mark] = item.color;
      }
    });
    this.dict.getItems('direction_type').subscribe(data => {
      for ( const item of data ) {
        this.direction_type[item.mark] = item.title;
        this.color_direction[item.mark] = item.color;
      }
    });

    this.org.getOrgs();
    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadHomings(this.query);
  }

  ngOnInit() {
    this.genders = this.dict.getItems('gender_type');
    this.getHouses();
  }

  loadHomings(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('homings', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
      this.status_stats = data.status_stats;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter(filterValue: string = '') {
    this.loadHomings(this.query);
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }

  moreserchbtn() {
    if (this.moreserch === false) {
      this.moreserch = true;
    } else {
      this.moreserch = false;
    }
  }

}
