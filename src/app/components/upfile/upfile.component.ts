import { Component, OnInit } from '@angular/core';
import { UploaderService } from './uploader.service';
import { MessageService } from './message.service';
import { ExcelReaderService} from '../../services/excel-reader.service';


@Component({
  selector: 'app-upfile',
  templateUrl: './upfile.component.html',
  styleUrls: ['./upfile.component.scss']
})
export class UpfileComponent implements OnInit {
  message: string;
  constructor(public messageService: MessageService, private excel: ExcelReaderService) { }


  ngOnInit() {
  }
  onPicked(evt: any) {
    this.excel.read(evt, (data) => {
      console.log(data[0]);
    });
  }

}
