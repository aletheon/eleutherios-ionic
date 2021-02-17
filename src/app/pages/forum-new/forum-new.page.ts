import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription, BehaviorSubject, of, from, combineLatest, zip, timer, defer, throwError } from 'rxjs';

import * as _ from "lodash";
import {
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

@Component({
  selector: 'app-forum-new',
  templateUrl: './forum-new.page.html',
  styleUrls: ['./forum-new.page.scss'],
})
export class ForumNewPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('main-title', { static: false }) titleRef: ElementRef;

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
    private router: Router) { }

  ngOnDestroy () {
    console.log('ngOnDestroy rob');
  }

  ngAfterViewInit () {
    console.log('ngAfterViewInit rob');
  }

  ngOnInit() {
    const that = this;
    console.log('ngOnInit rob');

  }

  // https://edupala.com/ionic-loading-example/
  ionViewDidLoad() {
    console.log('ionViewDidLoad rob');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter rob');
  }

  ionViewDidEnter () {
    console.log('ionViewDidEnter rob');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave rob');
  }

  ionViewWillUnload(){
    console.log('ionViewWillUnload rob');
  }

  ionViewWillLeave (){
    console.log('ionViewWillLeave rob');
  }

}
