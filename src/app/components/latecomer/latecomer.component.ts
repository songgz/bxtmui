import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {DictService} from '../../services/dict.service';
import {OrgService} from '../../services/org.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ExcelFileService} from '../../services/excel-file.service';
@Component({
  selector: 'app-latecomer',
  templateUrl: './latecomer.component.html',
  styleUrls: ['./latecomer.component.scss']
})
export class LatecomerComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'user_name', 'user_sno', 'dept_title', 'dorm_title', 'pass_time', 'direction', 'status', 'reside'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true }) sort: MatSort;
  query: any = {};
  sleep_status: any = {};
  direction_type: any = {};
  color_status: any = {};
  color_direction: any = {};
  // houses: Observable<any[]>;
  houses: any[] = [];
  floors: any[] = [];
  rooms: any[] = [];
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  file: ExcelFileService = null;
  progressbar: number;
  selectedDate: any;

  constructor(private rest: RestService, private  dict: DictService, public org: OrgService,
              private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource([]);
    this.dict.getItems('sleep_status').subscribe(data => {
      for (const item of data) {
        this.sleep_status[item.mark] = item.title;
        this.color_status[item.mark] = item.color;
      }
    });
    this.dict.getItems('direction_type').subscribe(data => {
      for (const item of data) {
        this.direction_type[item.mark] = item.title;
        this.color_direction[item.mark] = item.color;
      }
    });
    this.org.getOrgs();
  }

  ngOnInit() {
    // this.loadLatecomers(this.query);
    this.getHouses();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLatecomers(this.query);
  }
  applyFilter() {
    this.loadLatecomers(this.query);
  }
  changeHouse() {
    this.query['page'] = 1;
    this.query.facility_id = this.query.house_id;
    this.loadLatecomers(this.query);
    this.getFloors();
    this.query.floor_id = null;
    this.query.room_id = null;
    this.query.rooms = [];
  }

  changeFloor() {
    this.query['page'] = 1;
    this.query.facility_id = this.query.floor_id;
    this.loadLatecomers(this.query);
    this.getRooms();
    this.query.room_id = null;
  }

  changeRoom() {
    this.query['page'] = 1;
    this.query.facility_id = this.query.room_id;
    this.loadLatecomers(this.query);
  }
  // getHouses() {
  //   this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  // }

  getHouses() {
    this.rest.index('houses').subscribe((data: any) => {
      this.houses = data.result;
      if (this.houses.length > 0) {
        this.query.facility_access_id = this.query.facility_access_id || this.houses[0].id;
        // this.getFloors();
        if (this.query.facility_access_id == null) {
          this.query.facility_access_id = this.query.facility_access_id;
          // this.loadStudents(this.query);
        }
      }
    });
  }

  getFloors() {
    const options = {};
    options['pre'] = 999;
    options['parent_id'] = this.query.house_id;
    this.rest.index('floors', options ).subscribe((data: any) => {
      this.floors = data.result;
      if (this.floors.length > 0 && this.query.floor_id) {
        this.getRooms();
      }
    });
  }
  getRooms() {
    const options = {};
    options['pre'] = 9999;
    options['parent_id'] = this.query.floor_id;
    this.rest.index('rooms', options ).subscribe((data: any) => {
      this.rooms = data.result;
    });
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



  async export_excel() {
    this.progressbar = 1;
    this.file = new ExcelFileService(['姓名', '学号', '公寓', '组织', '出入时间', '出入', '状态', '确认']);
    this.query['pre'] = 100;
    const len = this.pageLength / 100 ;
    for (let i = 0; i <= len; i++ ) {
      this.query['page'] = i + 1;
      const data1: any = await this.rest.index('latecomers', this.query).toPromise();
      data1.result.forEach(d => {
        if (d.confirmed) {
          d.confirmed = d.cause;
        } else {
          d.confirmed = '未确认';
        }
        this.file.addRow([
          d.user_name,
          d.user_sno,
          d.user_dorm_title,
          d.user_dept_title,
          new Date(d.pass_time).toLocaleString(),
          this.direction_type[d.direction],
          this.sleep_status[d.status],
          // d.overtime,
          d.confirmed
        ]);
      });
      this.progressbar = (i + 1) / len * 100;
    }
    this.file.save('sheet1');
  }
}
