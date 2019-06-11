import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  header = ['Year', 'Month', 'Make', 'Model', 'Quantity', 'Pct']
  data = [
    [2007, 1, 'Volkswagen ', 'Volkswagen Passat', 1267, 10],
    [2007, 1, 'Toyota ', 'Toyota Rav4', 819, 6.5],
    [2007, 1, 'Toyota ', 'Toyota Avensis', 787, 6.2],
    [2007, 1, 'Volkswagen ', 'Volkswagen Golf', 720, 5.7],
    [2007, 1, 'Toyota ', 'Toyota Corolla', 691, 5.4]
  ];
  constructor() { }

  to_excel() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Car Data');
    const headerRow = worksheet.addRow(this.header);
    this.data.forEach(d => {
        const row = worksheet.addRow(d);
    });
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CarData.xlsx');
    });
  }
}
