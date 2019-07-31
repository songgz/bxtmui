import { Injectable } from '@angular/core';
import {Workbook, Worksheet} from 'exceljs';
import * as fs from 'file-saver';

// @ts-ignore
// @Injectable({
//   providedIn: 'root'
// })

export class ExcelFileService {
  workbook: Workbook = null;
  worksheet: Worksheet = null;

  constructor(header: any[], width: any[]) {
    this.workbook = new Workbook();
    this.worksheet = this.workbook.addWorksheet('Sheet1');
    this.worksheet.addRow(header);
    this.worksheet.columns = width;
    // console.log();
  }

  addRow(cells: any[]) {
    this.worksheet.addRow(cells);
  }

  save(name: string) {
    this.workbook.xlsx.writeBuffer().then(data => {
      console.log(data);
      const blob = new Blob([ data ], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
      fs.saveAs(blob, name + Date.parse(new Date().toString()) + '.xlsx');
    }, function (err: any) {
      console.log(err);
    });
  }
}
