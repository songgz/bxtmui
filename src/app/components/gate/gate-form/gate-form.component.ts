import { Component, OnInit } from '@angular/core';
import {RestService} from '../../../services/rest.service';
import {ActivatedRoute} from '@angular/router';
import {DictService} from '../../../services/dict.service';

@Component({
  selector: 'app-gate-form',
  templateUrl: './gate-form.component.html',
  styleUrls: ['./gate-form.component.scss']
})
export class GateFormComponent implements OnInit {
  gate: any = {};
  constructor(private rest: RestService, private route: ActivatedRoute, private  dict: DictService) { }


  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      if (params.get('id') != null) {
        this.gate.id = params.get('id');
        this.edit();
      }
    });
  }

  save() {
    if (this.gate.id != null) {
      this.update();
    } else {
      this.create();
    }
  }

  create() {
    this.rest.create('gates', {gate: this.gate}).subscribe((data: any) => {
      this.gate = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }

  edit() {
    this.rest.show('gates/' + this.gate.id).subscribe((data: any) => {
      this.gate = data;
    });
  }

  update() {
    this.rest.update('gates/' + this.gate.id, {gate: this.gate}).subscribe((data: any) => {
      this.gate = data;
      this.goBack();
    }, error => {
      this.rest.errorHandle(error);
    });
  }
  goBack() {
    this.rest.navigate(['/bxt/gates']);
  }
}
