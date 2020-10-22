import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { RestService } from '../../services/rest.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from } from 'rxjs/internal/observable/from';
import { last } from 'rxjs/internal/operators/last';
import { concatMap } from 'rxjs/internal/operators/concatMap';
import { StringDecoder } from 'string_decoder';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { stringify } from '@angular/compiler/src/util';
import { isEmpty } from 'rxjs/operators';
import { isNull } from 'util';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface MoreDialogData {
  code: any;
  recode: any;
}
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  displayedColumns = ['select', 'title', 'status', 'action'];
  dataSource: MatTableDataSource<any[]>;

  query: any = {};
  student_ids: any[] = [];
  houses: Observable<any[]>;
  moreConfig = false;

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: true }) sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  constructor(private rest: RestService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
    this.getHouses();
    // this.loadFaces();
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadFaces(this.query);
  }
  loadFaces(options = {}) {
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('cards', options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  applyFilter(filterValue: string = '') {
    filterValue = filterValue.trim();
    if (filterValue.length !== 0) {
      this.query['key'] = filterValue;
    }
    this.loadFaces(this.query);
  }

  getHouses() {
    this.houses = this.rest.index('houses').pipe(map((res: any) => res.result));
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
      this.rest.confirm({ title: '你确定要删除数据?' }).afterClosed().subscribe(res => {
        if (res) {
          from(this.student_ids).pipe(concatMap((id: any) => {
            return this.rest.destory('cards/' + id);
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
  Clear () {
    this.rest.confirm({title: '确定清除卡号为空的数据?'}).afterClosed().subscribe(res => {
      if (res) {
        let options = {};
        options = Object.assign(options , this.query);
        options['pre'] = 9999;
        // alert(JSON.stringify(options));
        // console.log (options);
        this.rest.index('cards', options).subscribe( (e: any) => {
          localStorage.setItem( 'FormatData' ,  JSON.stringify(e.result) );
          const Format_data = JSON.parse(localStorage.getItem('FormatData'));
          // let i = 0;
          const Claer_data = [];
          Format_data.map( data => {
            if ( data.ic_card === null || data.ic_card === '' || data.ic_card === 0 ) {
              Claer_data.push(data);
            }
          });
          console.log(Claer_data);
          from(Claer_data).pipe(concatMap((card: any) => {
            // console.log(Format_data.length + ': ' + i++ );
            // i++;
            // this.progressbar = Math.ceil ( i / Format_data.length * 100 );
            return this.rest.destory('cards/' + card.id);
           })).pipe(last()).subscribe(data => {
            localStorage.removeItem('FormatData');
             this.loadFaces(this.query);
           }, error => {
             this.rest.errorHandle(error);
           });
        }, error => {
          localStorage.removeItem('FormatData');
          this.rest.errorHandle(error);
        });
      }
    });
  }
  Format () {
    this.rest.confirm({title: '确定格式化1000条数据?'}).afterClosed().subscribe(res => {
      if (res) {
        let options = {};
        options = Object.assign(options , this.query);
        options['pre'] = 1000;
        // alert(JSON.stringify(options));
        // console.log (options);
        this.rest.index('cards', options).subscribe( (e: any) => {
          localStorage.setItem( 'FormatData' ,  JSON.stringify(e.result) );
          const Format_data = JSON.parse(localStorage.getItem('FormatData'));
          // let i = 0;
          from(Format_data).pipe(concatMap((card: any) => {
            // console.log(Format_data.length + ': ' + i++ );
            // i++;
            // this.progressbar = Math.ceil ( i / Format_data.length * 100 );
            return this.rest.destory('cards/' + card.id);
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
  getId() {
    const date = new Date().toLocaleDateString();
    const id = Date.parse(date) / 100000;
    // const id = date;
    return id;
  }
  More(): void {
    // const data: any;
    const code = this.getId();
    const recode: any = '';
    // alert(code);
    const dialogRef = this.dialog.open(MoreDialogCardComponent, {
      width: '250px',
      data: {code: code , recode: recode}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // alert(result);
      const num = code.toString(16);
      // console.log(code);
      console.log(num);
      if ( result === num ) {
        this.moreConfig = !this.moreConfig;
        this.snackBar.open('授权成功', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      } else {
        this.snackBar.open('授权失败', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    });
  }

  update(id: string) {
    this.rest.navigate(['/bxt/students/', id, 'edit']);
  }
  delete(id: string) {
    this.rest.confirm({ title: '你确定要删除这条数据?' }).afterClosed().subscribe(res => {
      if (res) {
        this.rest.destory('cards/' + id).subscribe(data => {
          this.loadFaces(this.query);
        }, error => {
          this.rest.errorHandle(error);
        });
      }
    });
  }
}

@Component({
  selector: 'app-card-moredialog',
  templateUrl: './moredialog.html',
})

export class MoreDialogCardComponent {
  constructor(
    public dialogRef: MatDialogRef<MoreDialogCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MoreDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onClick(): void {
    this.dialogRef.close();
  }

}
