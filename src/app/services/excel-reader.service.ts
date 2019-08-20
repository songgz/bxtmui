import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelReaderService {

  constructor() {

  }

  read(evt: any, callback: Function) {
    const excel: DataTransfer = <DataTransfer>(evt.target);
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = workbook.SheetNames[0];
      const ws: XLSX.WorkSheet = workbook.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      callback(data);
    };
    fileReader.readAsBinaryString(excel.files[0]);
  }
}
