import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';

import {
  AuthService,
  SiteTotalService,
  UserForumService
} from '../../services';

import { Observable, Subscription, BehaviorSubject, of, combineLatest, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from "lodash";

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.page.html',
  styleUrls: ['./forum-list.page.scss'],
})
export class ForumListPage implements OnInit {
  private _total = new BehaviorSubject(0);
  private _subscription: Subscription;
  private _totalSubscription: Subscription;

  public numberItems: number = 10;
  public nextKey: any;
  public prevKeys: any[] = [];
  public loading: HTMLIonLoadingElement;
  public forums: Observable<any[]> = of([]);
  public forumsArray: any[] = [];
  public total: Observable<number> = this._total.asObservable();

  constructor(
    private auth: AuthService,
    private siteTotalService: SiteTotalService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userForumService: UserForumService) {
  }

  trackTags (index, forum) { return forum.forumId; }

  async ionViewWillEnter() {
    this.nextKey = null;
    this.prevKeys = [];

    // get total
    this._totalSubscription = this.siteTotalService.getTotal(this.auth.uid)
      .subscribe(total => {
        if (total){
          if (total.forumCount == 0)
            this._total.next(-1);
          else
            this._total.next(total.forumCount);
        }
      }
    );
    this.getForumList();
  }

  async ionViewWillLeave() {
    if (this._subscription)
      this._subscription.unsubscribe();

    if (this._totalSubscription)
      this._totalSubscription.unsubscribe();
  }

  async ngOnInit() {
  }

  async getForumList (key?: any) {
    const that = this;

    // loading
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await this.loading.present();

    this._subscription = this.userForumService.getForums(this.auth.uid, this.numberItems, key)
      .subscribe(forums => {
        this.forumsArray = _.slice(forums, 0, this.numberItems);
        this.forums = of(this.forumsArray);
        this.nextKey = _.get(forums[this.numberItems], 'creationDate');
        this.loading.dismiss();
      }
    );
  }

  async delete (forum) {
    // loading
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await this.loading.present();

    this.userForumService.delete(this.auth.uid, forum.forumId).then(() =>{
      this.loading.dismiss();
    })
    .catch(error =>{
      this.showError(`<center>${error.message}</center>`).then(() => {
        this.loading.dismiss();
      });
    });
  }

  onNext () {
    this.prevKeys.push(_.first(this.forumsArray)['creationDate']);
    this.getForumList(this.nextKey);
  }

  onPrev () {
    const prevKey = _.last(this.prevKeys); // get last key
    this.prevKeys = _.dropRight(this.prevKeys); // delete last key
    this.getForumList(prevKey);
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
