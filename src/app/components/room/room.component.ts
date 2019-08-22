import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';
import {DictService} from '../../services/dict.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit {
  displayedColumns = ['title', 'total_beds', 'vacant_beds', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;
  query: any = {};
  houses: Observable<any[]>;
  floors: Observable<any[]>;
  bed_stats: any = {};
  @ViewChild(MatPaginator, { read: true, static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true, static: false }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;

  constructor(private rest: RestService, private dict: DictService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    // this.loadRooms();
    this.getHouses();
    // this.getFloors();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRooms(this.query);
  }
  loadRooms(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('rooms', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
      this.bed_stats = data.bed_stats;
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }
  getFloors(houseId: string) {
    const options = {};
    options['parent_id'] = houseId;
    this.rest.index('floors', options ).subscribe((data: any) => {
      this.floors = data.result;
    });
  }
  setFloor() {
    if (this.query.floor_id) {
      this.query = JSON.parse(JSON.stringify(this.query).replace(/floor_id/g, 'parent_id'));
      this.loadRooms(this.query);
    }
  }

  applyFilter() {
    if (this.query.house_id) {
      this.getFloors(this.query.house_id);
    }
    this.loadRooms(this.query);
  }


  public update (id: string)  {
    this.rest.navigate(['/bxt/rooms/', id, 'edit']);
  }

  public delete (id: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('rooms/' + id).subscribe(data => {
          this.loadRooms(this.query);
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }

}
