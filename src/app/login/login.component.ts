import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JwtService} from '../services/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  constructor(private router: Router, private jwt: JwtService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      console.log(params.get('username'));
      this.username = params.get('username');
      this.password = params.get('password');
      if ( this.username != null && this.password != null) {
        this.onLogin();
      }
    });
  }

  onLogin() {
    this.jwt.login(this.username, this.password);
    this.router.navigate(['/dashboard']);
  }

}
