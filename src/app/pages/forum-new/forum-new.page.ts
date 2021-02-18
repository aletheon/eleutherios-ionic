import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LoadingController, ToastController, AlertController, IonInput } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription, BehaviorSubject, of, from, combineLatest, zip, timer, defer, throwError } from 'rxjs';
import firebase from 'firebase/app';

// https://edupala.com/ionic-loading-example/
// ionViewDidEnter
// ionViewDidLeave
// ionViewWillUnload

import * as _ from "lodash";
import {
  AuthService,
  SiteTotalService,
  UserServiceService,
  UserActivityService,
  UserForumTagService,
  UserForumImageService,
  UserServiceImageService,
  UserForumServiceBlockService,
  UserServiceForumBlockService,
  UserServiceBlockService,
  UserServiceUserBlockService,
  UserForumUserBlockService,
  UserForumRegistrantService,
  UserTagService,
  ServiceService,
  TagService,
  UserForumService,
  UserImageService,
  UserServiceTagService
} from '../../services';
import {
  Forum
} from '../../models';

@Component({
  selector: 'app-forum-new',
  templateUrl: './forum-new.page.html',
  styleUrls: ['./forum-new.page.scss'],
})
export class ForumNewPage implements OnInit, OnDestroy {
  public forumGroup: FormGroup;
  public searchPrivateServices: boolean = false;
  public searchServiceIncludeTagsInSearch: boolean = false;
  public loading: HTMLIonLoadingElement;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private siteTotalService: SiteTotalService,
    private userActivityService: UserActivityService,
    private userForumTagService: UserForumTagService,
    private userForumImageService: UserForumImageService,
    private userServiceImageService: UserServiceImageService,
    private userForumServiceBlockService: UserForumServiceBlockService,
    private userServiceForumBlockService: UserServiceForumBlockService,
    private userServiceBlockService: UserServiceBlockService,
    private userServiceUserBlockService: UserServiceUserBlockService,
    private userForumUserBlockService: UserForumUserBlockService,
    private userForumRegistrantService: UserForumRegistrantService,
    private userTagService: UserTagService,
    private serviceService: ServiceService,
    private userForumService: UserForumService,
    private userImageService: UserImageService,
    private userServiceTagService: UserServiceTagService,
    private loadingController: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnDestroy () {
  }

  async ngOnInit() {
    this.forumGroup = this.fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      desc: ['', Validators.required],
      img: ''
    })

    this.loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await this.loading.present();

    this.searchPrivateServices = true;
    this.searchServiceIncludeTagsInSearch = true;
    const forum: Forum = {
      forumId: '',
      parentId: '',
      parentUid: '',
      uid: this.authService.uid,
      type: 'Private',
      title: '',
      title_lowercase: '',
      description: '',
      website: '',
      indexed: false,
      includeDescriptionInDetailPage: false,
      includeImagesInDetailPage: false,
      includeTagsInDetailPage: false,
      lastUpdateDate: firebase.firestore.FieldValue.serverTimestamp(),
      creationDate: firebase.firestore.FieldValue.serverTimestamp()
    };

    this.route.queryParams.subscribe(async (params: Params) => {
      if (params['serviceId']){
        console.log('params ' + params['serviceId']);
      }
      else {
        console.log('no serviceId param');
      }
      await this.loading.dismiss();
    });
  }

  // ionViewWillEnter() {
  //   console.log('ionViewWillEnter rob');
  // }

  // ionViewWillLeave (){
  //   console.log('ionViewWillLeave rob');
  // }
}
