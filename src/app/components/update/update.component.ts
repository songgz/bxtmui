import { Component, OnInit } from '@angular/core';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  uploader: FileUploader;
  baseUrl: string;
  ver: any;
  disabled_upBtn = true;
  constructor() {
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'packages',
      // headers: [{name: 'Accept', value: 'application/json'}],
      autoUpload: false,
      method: 'POST',
      itemAlias: 'package[patch]'
    });
    this.uploader.onBeforeUploadItem = (item: FileItem) => {
      item.withCredentials = false;
      this.uploader.options.additionalParameter = {
        'package[ver]': this.ver
      };
    };
  }
  selectedFileOnChanged() {
    this.uploader.queue.forEach((val, i, array) => {
      this.uploader.queue[0].onSuccess = (response, status, headers) => {
        if (status === 201) {
          console.log('upload success');

        } else {
          console.log('upload fail');
        }
      };
      this.uploader.queue[0].upload();
    });
  }
  printF() {
    console.log(this.uploader);
    if (this.ver && this.uploader.queue.length === 1) {
      this.disabled_upBtn = false;
    } else {
      this.disabled_upBtn = true;
    }
  }

}
