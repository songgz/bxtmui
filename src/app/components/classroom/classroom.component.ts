import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit, AfterViewInit {
  displayedColumns = [ 'title', 'updated_at', 'action'];
  dataSource: MatTableDataSource<any[]>;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;

  constructor(private rest: RestService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.loadClassrooms();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClassrooms();
  }

  loadClassrooms(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('classrooms', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter(filterValue: string) {
    this.loadClassrooms({key: filterValue.trim()});
  }

  public update (id: string)  {
    this.rest.navigate(['/bxt/classrooms/', id, 'edit']);
  }

  public delete (id: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('classrooms/' + id).subscribe(data => {
          this.loadClassrooms();
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }
}
