import { Component, OnInit } from '@angular/core';
import { UploaderService } from './uploader.service';
import { MessageService } from './message.service';
import { ExcelReaderService} from '../../services/excel-reader.service';
import {RestService} from '../../services/rest.service';


@Component({
  selector: 'app-upfile',
  templateUrl: './upfile.component.html',
  styleUrls: ['./upfile.component.scss']
})
export class UpfileComponent implements OnInit {
  message: string;
  constructor(public messageService: MessageService, private excel: ExcelReaderService, private rest: RestService) { }


  ngOnInit() {
  }
  onPicked(evt: any) {
    const r = this.rest;
    this.excel.read(evt, (data) => {
      r.create('import_students', {import_student: {result: data}}).subscribe((res: any) => {

      }, error => {
        this.rest.errorHandle(error);
      });
      console.log(data[0]);
    });
  }

}
