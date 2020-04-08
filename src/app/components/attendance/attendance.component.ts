import { Component, OnInit, ViewChild ,Inject} from '@angular/core';
import { RestService } from '../../services/rest.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DictService } from '../../services/dict.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  data:any = {}
  displayedColumns = [ 'day', 'user_name', 'on_duty_time','off_duty_time','action'];
  dataSource: MatTableDataSource<any[]>;
  pageIndex = 0;
  pageSize = 10;
  pageLength = 0;
  query: any = {};
  constructor(private rest: RestService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([]);
  }
  ngOnInit() {

    this.data = [
      { "id": "5e51d25788dba0d9d4c3c6c4", "day": "2020-02-23", "user_name": "18", "status": "normal", "on_duty_time": "2020-02-23T09:16:07.349+08:00", "off_duty_time": null, "created_at": "2020-02-23T09:16:07.350+08:00", "updated_at": "2020-02-23T09:16:07.350+08:00" },
      { "id": "5e51d25788dba0d9d4c3c6c4", "day": "2020-02-23", "user_name": "18", "status": "normal", "on_duty_time": "2020-02-23T09:16:07.349+08:00", "off_duty_time": null, "created_at": "2020-02-23T09:16:07.350+08:00", "updated_at": "2020-02-23T09:16:07.350+08:00" },
      { "id": "5e51d25788dba0d9d4c3c6c4", "day": "2020-02-23", "user_name": "18", "status": "normal", "on_duty_time": "2020-02-23T09:16:07.349+08:00", "off_duty_time": null, "created_at": "2020-02-23T09:16:07.350+08:00", "updated_at": "2020-02-23T09:16:07.350+08:00" },
      
      { "id": "5e51d25788dba0d9d4c3c6c4", "day": "2020-02-23", "user_name": "18", "status": "normal", "on_duty_time": "2020-02-23T09:16:07.349+08:00", "off_duty_time": null, "created_at": "2020-02-23T09:16:07.350+08:00", "updated_at": "2020-02-23T09:16:07.350+08:00" },
      { "id": "5e51d25788dba0d9d4c3c6c4", "day": "2020-02-23", "user_name": "18", "status": "normal", "on_duty_time": "2020-02-23T09:16:07.349+08:00", "off_duty_time": null, "created_at": "2020-02-23T09:16:07.350+08:00", "updated_at": "2020-02-23T09:16:07.350+08:00" }
  
    ];
    this.dataSource = new MatTableDataSource(this.data);
    console.log(this.dataSource)
      // this.loadAttendances();

  };

  loadAttendances(options = {}){
    options['page'] = this.pageIndex + 1;
    options['pre'] = this.pageSize;
    this.rest.index('attendances',options).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource(data.result);
      this.pageLength = data.paginate_meta.total_count;
      this.pageSize = data.paginate_meta.current_per_page;
      this.pageIndex = data.paginate_meta.current_page - 1;
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  paginate(event) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAttendances(this.query);
  }
  
  openDialog(row: any) {
    this.dialog.open(DialogData, {
      data: {
       data: row
      }
    });
  }
  
}
export interface DialogData {
  dataid: string;
}
@Component({
  selector: 'app-data-dialog',
  templateUrl: './DialogData.html',
})

export class DialogData {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
  ngOnInit() {
    console.log(this.data);
  }
}