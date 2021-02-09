import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.page.html',
  styleUrls: ['./receipt-list.page.scss'],
})
export class ReceiptListPage implements OnInit {

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
