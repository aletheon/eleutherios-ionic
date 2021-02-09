import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.page.html',
  styleUrls: ['./tag-list.page.scss'],
})
export class TagListPage implements OnInit {

  constructor(public menuCtrl: MenuController, private router: Router) { }

  ngOnInit() {
  }

  openSideMenu() {
    this.menuCtrl.toggle();
  }

  home() {
    this.router.navigateByUrl('/');
  }

  forums() {
    this.router.navigateByUrl('/menu/forum-list');
  }

  services() {
    this.router.navigateByUrl('/menu/service-list');
  }

}
