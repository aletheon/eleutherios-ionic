import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services';

import { Subscription, Observable, of } from 'rxjs';
import {
  SiteTotalService
} from '../../services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  private _userTotalSubscription: Subscription;
  public userTotal: Observable<any>;

  constructor(public auth: AuthService,
    private siteTotalService: SiteTotalService){
  }

  ngOnInit() {
    // get user total
    this._userTotalSubscription = this.siteTotalService.getTotal(this.auth.uid)
      .subscribe(total => {
        if (total)
          this.userTotal = of(total);
        else {
          let total = {
            activityCount: 0,
            alertCount: 0,
            forumAlertCount: 0,
            forumBlockCount: 0,
            forumCount: 0,
            forumNotificationCount: 0,
            forumUserBlockCount: 0,
            imageCount: 0,
            notificationCount: 0,
            paymentAmount: 0,
            paymentCount: 0,
            receiptAmount: 0,
            receiptCount: 0,
            serviceAlertCount: 0,
            serviceBlockCount: 0,
            serviceCount: 0,
            serviceNotificationCount: 0,
            serviceUserBlockCount: 0,
            tagCount: 0
          };
          this.userTotal = of(total);
        }
      }
    );
  }

  signOut() {
    this.auth.signOut();
  }
}
