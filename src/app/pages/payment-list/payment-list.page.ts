import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.page.html',
  styleUrls: ['./payment-list.page.scss'],
})
export class PaymentListPage implements OnInit {

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
