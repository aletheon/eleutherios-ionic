import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-block-list',
  templateUrl: './block-list.page.html',
  styleUrls: ['./block-list.page.scss'],
})
export class BlockListPage implements OnInit {

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
