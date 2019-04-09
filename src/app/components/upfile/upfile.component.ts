import { Component, OnInit } from '@angular/core';
import { UploaderService } from './uploader.service';
import { MessageService } from './message.service';

@Component({
  selector: 'app-upfile',
  templateUrl: './upfile.component.html',
  styleUrls: ['./upfile.component.scss'],
  providers: [ UploaderService ]
})
export class UpfileComponent implements OnInit {
  message: string;
  constructor(public messageService: MessageService, private uploaderService: UploaderService) { }


  ngOnInit() {
  }
  onPicked(input: HTMLInputElement) {
    const file = input.files[0];
    if (file) {
      this.uploaderService.upload(file).subscribe(
        msg => {
          input.value = null;
          this.message = msg;
        }
      );
    }
  }

}
