import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {JwtAuthService} from '../services/jwt-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';

  constructor(private jwt: JwtAuthService, private activeRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((params: any) => {
      this.username = params.get('username');
      this.password = params.get('password');
      if ( this.username != null && this.password != null) {
        this.onLogin();
      }
    });
  }

  onLogin() {
    this.jwt.login(this.username, this.password).subscribe(data => {
      this.router.navigate(['/bxt']);
    });
  }

}
