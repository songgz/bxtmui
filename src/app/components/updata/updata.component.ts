import { Component, OnInit } from '@angular/core';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-updata',
  templateUrl: './updata.component.html',
  styleUrls: ['./updata.component.scss']
})
export class UpdataComponent implements OnInit {
  uploader: FileUploader;
  baseUrl: string;
  version_number: any;
  disabled_upBtn = true;
  constructor() {
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'up_data',
      // headers: [{name: 'Accept', value: 'application/json'}],
      autoUpload: false,
      method: 'POST',
      itemAlias: this.version_number
    });
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };
  }
  selectedFileOnChanged() {
    this.uploader.queue.forEach((val, i, array) => {
      this.uploader.queue[0].onSuccess = (response, status, headers) => {
        if (status === 200) {

        } else {

        }
      };
      this.uploader.queue[0].upload();
    });
  }
  printF() {
    console.log(this.uploader);
    if (this.version_number && this.uploader.queue.length === 1) {
      this.disabled_upBtn = false;
    } else {
      this.disabled_upBtn = true;
    }
  }
}
