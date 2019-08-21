import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ExcelReaderService} from '../../services/excel-reader.service';
import {RestService} from '../../services/rest.service';

@Component({
  selector: 'app-import-student',
  templateUrl: './import-student.component.html',
  styleUrls: ['./import-student.component.scss']
})
export class ImportStudentComponent implements OnInit {
  @Input() accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  students: [] = [];
  header: [] = [];
  constructor( private excel: ExcelReaderService, private rest: RestService, private el: ElementRef) { }

  ngOnInit() {
  }

  onLoad(evt: any) {
    this.excel.read(evt, (data) => {
      this.students = data;
    });
  }

  onImport() {
    this.send(1);
  }

  send(index) {
    this.rest.create('import_students', {import_student: {name: this.students[index][0], sno: this.students[index][1]}}).subscribe(data => {
      const greetDiv: HTMLElement = this.el.nativeElement.querySelector('#s' + index);
      greetDiv.style.color = 'red';
      if (index < this.students.length - 1) {
        this.send(index + 1);
      }
    }, error => {
      this.rest.errorHandle(error);
    });
  }

}
