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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private rest: RestService, private dict: DictService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.loadRooms();
    this.getHouses();
    this.getFloors();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(event => {
      this. loadRooms(this.query);
    });
  }
  loadRooms(options = {}) {
    options['page'] = this.paginator.pageIndex + 1;
    options['pre'] = this.paginator.pageSize;
    this.rest.index('rooms', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.paginator.length = data.paginate_meta.total_count;
      this.paginator.pageSize = data.paginate_meta.current_per_page;
      this.paginator.pageIndex = data.paginate_meta.current_page - 1;
      this.bed_stats = data.bed_stats;
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
  }
  getFloors() {
    this.rest.index('floors').subscribe((data: any) => {
      this.floors = data.result;
    });
  }

  applyFilter(filterValue: string = '') {
    filterValue = filterValue.trim();
    if (filterValue.length !== 0) {
      this.query['key'] = filterValue;
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
          this.loadRooms();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }

}
