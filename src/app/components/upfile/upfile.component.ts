import { Component, OnInit } from '@angular/core';
import { UploaderService } from './uploader.service';
import { MessageService } from './message.service';
import {Workbook, Worksheet} from 'exceljs';

@Component({
  selector: 'app-upfile',
  templateUrl: './upfile.component.html',
  styleUrls: ['./upfile.component.scss'],
  providers: [ UploaderService ]
})
export class UpfileComponent implements OnInit {
  message: string;
  constructor(public messageService: MessageService, private uploaderService: UploaderService) { }


  ngOnInit() {
  }
  onPicked(input: HTMLInputElement) {
    const file: any = input.files[0];
    const fileReader: FileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onloadend = function (e: any) {
      console.log(e.target);
      const workbook = new Workbook();
      workbook.xlsx.load(e.target.result)
        .then(function() {
          const worksheet = workbook.getWorksheet(0);
          worksheet.eachRow(function(row, rowNumber) {
            console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
          });
        });
    };
  }

}
