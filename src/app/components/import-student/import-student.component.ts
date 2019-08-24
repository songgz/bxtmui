import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {ExcelReaderService} from '../../services/excel-reader.service';
import {RestService} from '../../services/rest.service';
import {concat, from} from 'rxjs';

@Component({
  selector: 'app-import-student',
  templateUrl: './import-student.component.html',
  styleUrls: ['./import-student.component.scss']
})
export class ImportStudentComponent implements OnInit {
  @Input() accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  students: [] = [];
  header: string[] = [];
  constructor( private excel: ExcelReaderService, private rest: RestService, private el: ElementRef) { }

  ngOnInit() {
  }

  onLoad(evt: any) {
    this.excel.read(evt, (data) => {
      this.header = data.shift();
      console.log(this.header);
      this.students = data;
    });
  }

  onImport() {
    this.send(0);
  }

  send(index) {
    const row = this.students[index];
    const student = {
      name: row[this.header.indexOf('姓名')],
      sno: row[this.header.indexOf('学号')],
      college: row[this.header.indexOf('院系')],
      department: row[this.header.indexOf('专业')],
      house: row[this.header.indexOf('公寓号')],
      dorm: row[this.header.indexOf('寝室号')],
      bed: row[this.header.indexOf('床位号')],
      rating_num: row[this.header.indexOf('住宿标准（人间）')],
      classroom: row[this.header.indexOf('班级')],
      hometown: row[this.header.indexOf('生源地')],
      gender: row[this.header.indexOf('性别')],
      nation: row[this.header.indexOf('民族')],
      plan_type: row[this.header.indexOf('计划类别')],
      section: row[this.header.indexOf('科类')],
      examinee_category: row[this.header.indexOf('考生类别')],
      admission_batch: row[this.header.indexOf('考生类别')],
      language: row[this.header.indexOf('外语语种')],
      exceptional_candidates: row[this.header.indexOf('特殊考生')],
      political_landscape: row[this.header.indexOf('政治面貌')],
      birthday: row[this.header.indexOf('出生日期')],
      telephone: row[this.header.indexOf('联系电话')]
    };
    this.rest.create('import_students', {import_student: student}).subscribe(data => {
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
