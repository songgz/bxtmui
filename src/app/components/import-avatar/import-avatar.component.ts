import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-import-avatar',
  templateUrl: './import-avatar.component.html',
  styleUrls: ['./import-avatar.component.scss']
})
export class ImportAvatarComponent implements OnInit, AfterViewInit {
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  response: string;
  baseUrl: string;

  constructor() {
    this.baseUrl = environment.baseUrl;
  }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'import_avatars',
      // headers: [{name: 'Accept', value: 'application/json'}],
      // autoUpload: true,
      method: 'POST',
      itemAlias: 'avatar'
    });
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };
  }

  ngAfterViewInit() {
    this.uploader.onAfterAddingFile = (item => {
    });
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const data = JSON.parse(response);
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const error = JSON.parse(response);
  }

  saveImages() {
    const fileCount: number = this.uploader.queue.length;
    if (fileCount > 0) {
      this.uploader.queue.forEach((val, i, array) => {
        const fileReader = new FileReader();
        fileReader.onloadend = (e: any) => {
          const imageData = e.target.result;
          let rawData = imageData.split('base64,');
          if (rawData.length > 1) {
            rawData = rawData[1];
          }
        };
        fileReader.readAsDataURL(val._file);
      });
    }
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

  fileOverBase(event) {
    this.hasBaseDropZoneOver = event;
  }
  fileDropOver(event) {
    // 文件拖拽完成的回调函数
  }
}
