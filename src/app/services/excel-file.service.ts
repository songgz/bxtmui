import { Injectable } from '@angular/core';
// import {Workbook, Worksheet} from 'exceljs';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';

// @ts-ignore
// @Injectable({
//   providedIn: 'root'
// })

export class ExcelFileService {
  data = [];

  constructor(header: any[]) {
    this.data.push(header);
  }

  addRow(cells: any[]) {
    this.data.push(cells);
  }

  save(name: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([ excelBuffer ], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
    fs.saveAs(blob, name + Date.parse(new Date().toString()) + '.xlsx');
  }
}
