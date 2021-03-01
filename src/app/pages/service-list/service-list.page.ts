import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import * as lodash from "lodash";

import {
  AuthService,
  SiteTotalService,
  UserServiceService
} from '../../services';

import { Observable, Subscription, BehaviorSubject, of, combineLatest, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from "lodash";

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.page.html',
  styleUrls: ['./service-list.page.scss'],
})
export class ServiceListPage implements OnInit {
  private _total = new BehaviorSubject(0);
  private _subscription: Subscription;
  private _totalSubscription: Subscription;

  public numberItems: number = 10;
  public nextKey: any;
  public prevKeys: any[] = [];
  public loading: HTMLIonLoadingElement;
  public services: Observable<any[]> = of([]);
  public servicesArray: any[] = [];
  public total: Observable<number> = this._total.asObservable();

  constructor(
    private auth: AuthService,
    private siteTotalService: SiteTotalService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userServiceService: UserServiceService) {
  }

  trackTags (index, service) { return service.serviceId; }

  async ionViewWillEnter() {
    this.nextKey = null;
    this.prevKeys = [];

    // get total
    this._totalSubscription = this.siteTotalService.getTotal(this.auth.uid)
      .subscribe(total => {
        if (total){
          if (total.serviceCount == 0)
            this._total.next(-1);
          else
            this._total.next(total.serviceCount);
        }
      }
    );
    this.getServiceList();
  }

  async ionViewWillLeave() {
    if (this._subscription)
      this._subscription.unsubscribe();

    if (this._totalSubscription)
      this._totalSubscription.unsubscribe();
  }

  async ngOnInit() {
  }

  async getServiceList (key?: any) {
    const that = this;

    // loading
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await this.loading.present();

    this._subscription = this.userServiceService.getServices(this.auth.uid, this.numberItems, key)
      .subscribe(services => {
        this.servicesArray = _.slice(services, 0, this.numberItems);
        this.services = of(this.servicesArray);
        this.nextKey = _.get(services[this.numberItems], 'creationDate');
        this.loading.dismiss();
      }
    );
  }

  async delete (service) {
    // loading
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await this.loading.present();

    this.userServiceService.delete(this.auth.uid, service.serviceId).then(() =>{
      this.loading.dismiss();
    })
    .catch(error =>{
      this.showError(`<center>${error.message}</center>`).then(() => {
        this.loading.dismiss();
      });
    });
  }

  onNext () {
    this.prevKeys.push(_.first(this.servicesArray)['creationDate']);
    this.getServiceList(this.nextKey);
  }

  onPrev () {
    const prevKey = _.last(this.prevKeys); // get last key
    this.prevKeys = _.dropRight(this.prevKeys); // delete last key
    this.getServiceList(prevKey);
  }

  async showError(error){
    const toast = await this.toastCtrl.create({
      duration: 3000,
      message: error,
      color: 'danger'
    });
    toast.present();
  }
}
