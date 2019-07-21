import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {MatDialog} from '@angular/material';
import {PasswordDialogComponent} from '../../components/password-dialog/password-dialog.component';
import {JwtAuthService} from '../../services/jwt-auth.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit {
  public pushRightClass: string;

  constructor(public router: Router, private dialog: MatDialog, private auth: JwtAuthService) {
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
        this.toggleSidebar();
      }
    });
  }

  ngOnInit() {
    this.pushRightClass = 'push-right';
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  onLoggedout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  refresh() {
    this.auth.refresh().subscribe();
  }

  changeLang(language: string) {
  }

  modify_password() {
    // msgDialog({title: data.status}).afterClosed().subscribe(result => {});
    this.dialog.open(PasswordDialogComponent, {data: {}}).afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
