import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RestService} from '../../services/rest.service';
import {Observable} from 'rxjs';
import {DictService} from '../../services/dict.service';
import {map} from 'rxjs/operators';
import {OrgService} from '../../services/org.service';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit, AfterViewInit {
  // displayedColumns = [ 'name', 'sno', 'dept_title', 'dorm_title', 'pass_time', 'status', 'overtime', 'reside'];
  displayedColumns = [ 'name', 'sno', 'dorm_title', 'pass_time', 'status', 'overtime', 'reside'];
  dataSource: MatTableDataSource<any[]>;
  query: any = {}
  moreserch = false;
  genders: Observable<any[]>;
  houses: Observable<any[]>;
  sleep_status: any = {};
  color_status: any = {};
  status_stats: any = {};

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
    this.dataSource = new MatTableDataSource([]);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(event => {
      this.loadIncomings();
    });
  }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.loadIncomings();
    this.genders = this.dict.getItems('gender_type');
    this.getHouses();
  }

  loadIncomings(options = {}) {
    options['page'] = this.paginator.pageIndex + 1;
    options['pre'] = this.paginator.pageSize;
    this.rest.index('incomings', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.paginator.length = data.paginate_meta.total_count;
      this.paginator.pageSize = data.paginate_meta.current_per_page;
      this.paginator.pageIndex = data.paginate_meta.current_page - 1;
      this.status_stats = data.status_stats;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter(filterValue: string = '') {
    this.loadIncomings(this.query);
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
