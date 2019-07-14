import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import {DictService} from '../../services/dict.service';
import {Observable} from 'rxjs';
import {OrgService} from '../../services/org.service';
import {map} from 'rxjs/operators';
import {ImgDialogStudentComponent} from "../student/student.component";
import { MatDialog } from '@angular/material/dialog';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'name', 'sno',  'dorm', 'pass_time', 'status', 'overtime', 'access_id', 'snap'];
  dataSource: MatTableDataSource<any[]>;
  sleep_status: any = {};
  color_status: any = {};
  query: any = {};
  moreserch = false;
  houses: Observable<any[]>;
  accesses = [];
  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  baseUrl: any;


  constructor(private rest: RestService, private  dict: DictService, public org: OrgService, public dialog: MatDialog) {
    this.dict.getItems('sleep_status').subscribe(data => {
      for (const item of data) {
        this.sleep_status[item.mark] = item.title;
        this.color_status[item.mark] = item.color;
      }
    });
    this.org.getOrgs();
    this.getHouses();
    this.getAccesses();
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.baseUrl = environment.baseUrl;
    this.loadTrackers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTrackers(this.query);
  }

  loadTrackers(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('trackers', options).subscribe((data: any) => {
      // 门禁重命名
      data.result.forEach( data1 => {
        data.access_id = this.accesses.find( item => item.id === data1.access_id).title;
      });

      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter() {
    this.loadTrackers(this.query);
  }
  getAccesses(options = {}) {
    options['pre'] = 9999;
    this.rest.index('accesses', options).subscribe((data: any) => {
      this.accesses =  data.result;
    }, error => {
    this.rest.errorHandle(error);
    });
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }
  openDialog(id: string) {
    // console.log(id)
    this.dialog.open(ImgDialogStudentComponent, {
      data: {
        dataid: id
      }
    });
  }

}
