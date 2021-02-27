import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import firebase from 'firebase/app';
import * as lodash from "lodash";

import {
  AuthService,
  SiteTotalService,
  UserTagService
} from '../../services';

import { Observable, Subscription, BehaviorSubject, of, combineLatest, zip } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as _ from "lodash";

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.page.html',
  styleUrls: ['./tag-list.page.scss'],
})
export class TagListPage implements OnInit {
  private _total = new BehaviorSubject(0);
  private _subscription: Subscription;
  private _totalSubscription: Subscription;

  public numberItems: number = 10;
  public nextKey: any;
  public prevKeys: any[] = [];
  public loading: HTMLIonLoadingElement;
  public tags: Observable<any[]> = of([]);
  public tagsArray: any[] = [];
  public total: Observable<number> = this._total.asObservable();

  constructor(
    private auth: AuthService,
    private siteTotalService: SiteTotalService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userTagService: UserTagService) {
  }

  trackTags (index, tag) { return tag.tagId; }

  async ionViewWillEnter() {
    this.nextKey = null;
    this.prevKeys = [];

    // get total
    this._totalSubscription = this.siteTotalService.getTotal(this.auth.uid)
      .subscribe(total => {
        if (total){
          if (total.tagCount == 0)
            this._total.next(-1);
          else
            this._total.next(total.tagCount);
        }
      }
    );
    this.getTagList();
  }

  async ionViewWillLeave() {
    if (this._subscription)
      this._subscription.unsubscribe();

    if (this._totalSubscription)
      this._totalSubscription.unsubscribe();
  }

  async ngOnInit() {
  }

  async getTagList (key?: any) {
    const that = this;

    if (this._subscription) this._subscription.unsubscribe();

    // loading
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await this.loading.present();

    this._subscription = this.userTagService.getTags(this.auth.uid, this.numberItems, key).pipe(
      switchMap(tags => {
        if (tags && tags.length > 0){
          let observables = tags.map(tag => {
            if (tag){
              let getTagTotal$ = that.siteTotalService.getTotal(tag.tagId);

              return combineLatest([getTagTotal$]).pipe(
                switchMap(results => {
                  const [tagTotal] = results;

                  if (tagTotal){
                    tag.forumCount = tagTotal.forumCount;
                    tag.serviceCount = tagTotal.serviceCount;
                    tag.notificationCount = tagTotal.notificationCount;
                  }
                  else {
                    tag.forumCount = 0;
                    tag.serviceCount = 0;
                    tag.notificationCount = 0;
                  }
                  return of(tag);
                })
              );
            }
            else return of(null);
          });

          return zip(...observables, (...results) => {
            return results.map((result, i) => {
              return tags[i];
            });
          });
        }
        else return of([]);
      })
    )
    .subscribe(tags => {
      this.tagsArray = _.slice(tags, 0, this.numberItems);
      this.tags = of(this.tagsArray);
      this.nextKey = _.get(tags[this.numberItems], 'creationDate');
      this.loading.dismiss();
    });
  }

  async delete (tag) {
    // loading
    this.loading = await this.loadingCtrl.create({
      message: 'Loading...'
    });
    await this.loading.present();

    const tagTotalSubscription = this.siteTotalService.getTotal(tag.tagId)
      .subscribe(total => {
        if (total){
          if (total.forumCount == 0 && total.serviceCount == 0 && total.notificationCount == 0){
            this.userTagService.delete(this.auth.uid, tag.tagId).then(() =>{
              this.loading.dismiss();
            })
            .catch(error =>{
              this.showError(`<center>${error.message}</center>`).then(() => {
                this.loading.dismiss();
              });
            });
          }
          else {
            let message = "Unable to delete tag, it is currently used by ";

            if (total.forumCount > 0)
              message += `${total.forumCount} forum(s), `;

            if (total.serviceCount > 0)
              message += `${total.serviceCount} service(s), `;

            if (total.notificationCount > 0)
              message += `${total.notificationCount} notification(s), `;

            message = message.substring(0, message.length-2) + '.';

            this.showError(`<center>${message}</center>`).then(() => {
              this.loading.dismiss();
            });
          }
          tagTotalSubscription.unsubscribe();
        }
      }
    );
  }

  onNext () {
    this.prevKeys.push(_.first(this.tagsArray)['creationDate']);
    this.getTagList(this.nextKey);
  }

  onPrev () {
    const prevKey = _.last(this.prevKeys); // get last key
    this.prevKeys = _.dropRight(this.prevKeys); // delete last key
    this.getTagList(prevKey);
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
