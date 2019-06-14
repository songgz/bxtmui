import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() { }

  to_excel(header, result,  myCallback: (k: string, d: any) => void) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    const headerRow = worksheet.addRow(Object.values(header));
    result.forEach(d => {
        const cells = [];
        for (const k of Object.keys(header)) {
          cells.push(myCallback(k, d));
        }
        const row = worksheet.addRow(cells);
    });
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'sheet1' + Date.parse(new Date().toString()) + '.xlsx');
    });
  }
}
