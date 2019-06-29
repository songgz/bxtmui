import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
// export class ExcelService {
//   constructor() { }
//   to_excel(header, result,  myCallback: (k: string, d: any) => void) {
//     const workbook = new Workbook();
//     const worksheet = workbook.addWorksheet('Sheet1');
//     const headerRow = worksheet.addRow(Object.values(header));
//     result.forEach(d => {
//         const cells = [];
//         for (const k of Object.keys(header)) {
//           cells.push(myCallback(k, d));
//         }
//         const row = worksheet.addRow(cells);
//     });
//     workbook.xlsx.writeBuffer().then((data) => {
//
//       const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       fs.saveAs(blob, 'sheet1' + Date.parse(new Date().toString()) + '.xlsx');
//     });
//   }
// }

export class SheetService {
  constructor() {
  }

  public jsontToSheet(json: any[], filename: string): void {
    //gengerate worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    //generate workbook and worhsheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //save file
    XLSX.writeFile(workbook, filename);
  }
}
