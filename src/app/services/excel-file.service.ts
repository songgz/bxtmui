import { Injectable } from '@angular/core';
import {Workbook, Worksheet} from 'exceljs';
import * as fs from 'file-saver';

// @Injectable({
//   providedIn: 'root'
// })
export class ExcelFileService {
  workbook: Workbook = null;
  worksheet: Worksheet = null;


  constructor(header: any[]) {
    this.workbook = new Workbook();
    this.worksheet = this.workbook.addWorksheet('Sheet1');
    this.worksheet.addRow(header);
  }

  addRow(cells: any[]) {
    this.worksheet.addRow(cells);
  }

  async save(name: string) {
    console.log(this.workbook.xlsx.writeBuffer());
    await this.workbook.xlsx.writeBuffer().then(async (data) => {
      console.log(data);
      const blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      console.log(blob);
      console.log(fs);
      fs.saveAs(blob, name + Date.parse(new Date().toString()) + '.xlsx');
    }, function (err: any) {
      console.log(err);
    });
  }
}
