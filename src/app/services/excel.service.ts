import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {  
  constructor() { }

  to_excel(header, data) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Car Data');
    const headerRow = worksheet.addRow(header.keys);
   
  }
}
