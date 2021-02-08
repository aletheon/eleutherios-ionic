import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'Forums(0)',
      url: '/menu/forum-list',
      mode: 'private'
    },
    {
      title: 'Services(0)',
      url: '/menu/service-list',
      mode: 'private'
    }
  ];

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  signOut() {
    this.auth.signOut();
  }
}
