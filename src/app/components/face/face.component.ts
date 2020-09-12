import { Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import {from} from 'rxjs/internal/observable/from';
import {last} from 'rxjs/internal/operators/last';
import {concatMap} from 'rxjs/internal/operators/concatMap';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.scss']
})
export class FaceComponent implements OnInit {
  displayedColumns = [ 'select', 'title', 'status', 'action'];
  dataSource: MatTableDataSource<any[]>;
  student_ids: any[] = [];
  query: any = {};

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  constructor(
    private rest: RestService,
    private snackBar: MatSnackBar
    ) {
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

  student_selected(teacher_id) {
    const i = this.student_ids.indexOf(teacher_id);
    if (i > -1) {
      this.student_ids.splice(i, 1);
    } else {
      this.student_ids.push(teacher_id);
    }
  }

  allSelect(e) {
    this.dataSource.data.forEach(row => {
      if (e.checked) {
        if (this.student_ids.indexOf(row['id']) < 0) {
          this.student_ids.push(row['id']);
        }
      } else {
        this.student_ids.splice(this.student_ids.indexOf(row['id']), 1);
      }
    });
  }
  allDel() {
    if (this.student_ids.length === 0) {
      this.snackBar.open('请选择数据', '', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.rest.confirm({title: '你确定要删除数据?'}).afterClosed().subscribe(res => {
        if (res) {
          from(this.student_ids).pipe(concatMap((id: any) => {
           return this.rest.destory('faces/' + id);
          })).pipe(last()).subscribe(data => {
            this.loadFaces(this.query);
            this.student_ids = [];
          }, error => {
            this.rest.errorHandle(error);
          });
        }
      });
    }
  }
  Claer () {
    this.rest.confirm({title: '确定清除图片为空的数据?'}).afterClosed().subscribe(res => {
      if (res) {
        let options = {};
        options = Object.assign(options , this.query);
        options['pre'] = 9999;
        // alert(JSON.stringify(options));
        // console.log (options);
        this.rest.index('faces', options).subscribe( (e: any) => {
          localStorage.setItem( 'FormatData' ,  JSON.stringify(e.result) );
          const Format_data = JSON.parse(localStorage.getItem('FormatData'));
          // let i = 0;
          const Claer_data = [];
          Format_data.map( data => {
            if (data.face_url === null ) {
              Claer_data.push(data);
            }
          });
          console.log(Claer_data);
          from(Claer_data).pipe(concatMap((faces: any) => {
            // console.log(Format_data.length + ': ' + i++ );
            // i++;
            // this.progressbar = Math.ceil ( i / Format_data.length * 100 );
            return this.rest.destory('faces/' + faces.id);
           })).pipe(last()).subscribe(data => {
            localStorage.removeItem('FormatData');
             this.loadFaces(this.query);
           }, error => {
             this.rest.errorHandle(error);
           });
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }
  Format () {
    this.rest.confirm({title: '确定格式化数据?'}).afterClosed().subscribe(res => {
      if (res) {
        let options = {};
        options = Object.assign(options , this.query);
        options['pre'] = 9999;
        // alert(JSON.stringify(options));
        // console.log (options);
        this.rest.index('faces', options).subscribe( (e: any) => {
          localStorage.setItem( 'FormatData' ,  JSON.stringify(e.result) );
          const Format_data = JSON.parse(localStorage.getItem('FormatData'));
          // let i = 0;
          from(Format_data).pipe(concatMap((faces: any) => {
            // console.log(Format_data.length + ': ' + i++ );
            // i++;
            // this.progressbar = Math.ceil ( i / Format_data.length * 100 );
            return this.rest.destory('faces/' + faces.id);
           })).pipe(last()).subscribe(data => {
            localStorage.removeItem('FormatData');
             this.loadFaces(this.query);
           }, error => {
             this.rest.errorHandle(error);
           });
        }, error => {
          this.rest.errorHandle(error);
        });
      }
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
