import { Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.scss']
})
export class FaceComponent implements OnInit {
  displayedColumns = [ 'title', 'status', 'action'];
  dataSource: MatTableDataSource<any[]>;

  query: any = {};

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  constructor(private rest: RestService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.loadFaces();
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFaces(this.query);
  }
  loadFaces(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('faces', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  public update (id: string)  {
    this.rest.navigate(['/bxt/faces/', id, 'edit']);
  }
  public delete (id: string) {
    this.rest.confirm({title: '你确定要删除这条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('faces/' + id).subscribe(data => {
          this.loadFaces(this.query);
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }
}
