import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LoadingController, ToastController, AlertController, IonInput } from '@ionic/angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription, BehaviorSubject, of, from, combineLatest, zip, timer, defer, throwError } from 'rxjs';
import { IonicSelectableComponent } from 'ionic-selectable';
import firebase from 'firebase/app';

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
  Forum,
  Tag
} from '../../models';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-forum-new',
  templateUrl: './forum-new.page.html',
  styleUrls: ['./forum-new.page.scss'],
})
export class ForumNewPage implements OnInit, OnDestroy {
  @ViewChild('mainTitle', { static: false }) titleRef: IonInput;

  private _searchTagsSubscription: Subscription;
  private _selectedTags: Tag[];

  public forumGroup: FormGroup;
  public searchPrivateServices: boolean = false;
  public searchServiceIncludeTagsInSearch: boolean = false;
  public loading: HTMLIonLoadingElement;


  // do this rob
  /// https://stackblitz.com/edit/ionic-selectable-adding-on-search-fail?file=app/pages/home/home.html




  filterTags(tags: Tag[], text: string) {
    return tags.filter(tag => {
      return tag.tag.toLowerCase().indexOf(text) !== -1 ||
        tag.tagId.toString().toLowerCase().indexOf(text) !== -1;
    });
  }

  tagChanged(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    this._selectedTags = event.value;

    let output: string = '';

    // Use of _.forEach() method
    _.forEach(this._selectedTags, function(value) {
      output += value.tag + ',';
    });

    console.log(output.substring(0, output.length-1));
  }

  searchTags(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this._searchTagsSubscription) {
      this._searchTagsSubscription.unsubscribe();
    }

    if (!text) {
      // Close any running subscription.
      if (this._searchTagsSubscription) {
        this._searchTagsSubscription.unsubscribe();
      }

      event.component.items = [];
      event.component.endSearch();
      return;
    }

    this._searchTagsSubscription = this.tagService.search(text).subscribe(tags => {
      // Subscription will be closed when unsubscribed manually.
      if (this._searchTagsSubscription.closed) {
        return;
      }
      event.component.items = this.filterTags(tags, text);
      event.component.endSearch();
    });
  }

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
    private tagService: TagService,
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

  async ngOnDestroy () {
  }

  async ngOnInit() {
    this.searchPrivateServices = true;
    this.searchServiceIncludeTagsInSearch = true;

    // this.forumGroup = this.fb.group({
    //   title: ['',[Validators.required, Validators.pattern(/^[A-Za-z0-9._\s]*$/)]],
    //   price: ['', Validators.required],
    //   desc: ['', Validators.required],
    //   img: ''
    // })

    this.forumGroup = this.fb.group({
      forumId:                            [''],
      parentId:                           [''],
      parentUid:                          [''],
      uid:                                [''],
      type:                               [''],
      title:                              ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9._\s]*$/)]],
      title_lowercase:                    [''],
      description:                        [''],
      website:                            [''],
      indexed:                            [''],
      includeDescriptionInDetailPage:     [''],
      includeImagesInDetailPage:          [''],
      includeTagsInDetailPage:            [''],
      searchPaymentType:                  [''],
      searchCurrency:                     [''],
      tag:                                [''],
      searchStartAmount:                  ['', [Validators.required, Validators.pattern(/^\s*-?\d+(\.\d{1,2})?\s*$/), Validators.min(0), Validators.max(999999.99)]],
      searchEndAmount:                    ['', [Validators.required, Validators.pattern(/^\s*-?\d+(\.\d{1,2})?\s*$/), Validators.min(0), Validators.max(999999.99)]],
      searchPrivateServices:              [''],
      searchServiceIncludeTagsInSearch:   [''],
      lastUpdateDate:                     [''],
      creationDate:                       ['']
    });
    this.forumGroup.get('searchPaymentType').setValue('Any');
    this.forumGroup.get('searchCurrency').setValue('NZD');
    this.forumGroup.get('searchStartAmount').setValue(1);
    this.forumGroup.get('searchEndAmount').setValue(10);
    this.forumGroup.get('type').setValue('Private');
    this.forumGroup.get('indexed').setValue(false);
    this.forumGroup.get('searchPrivateServices').setValue(this.searchPrivateServices);
    this.forumGroup.get('searchServiceIncludeTagsInSearch').setValue(this.searchServiceIncludeTagsInSearch);

    this.loading = await this.loadingController.create({
      message: 'Loading...'
    });
    await this.loading.present();

    // const forum: Forum = {
    //   forumId: '',
    //   parentId: '',
    //   parentUid: '',
    //   uid: this.authService.uid,
    //   type: 'Private',
    //   title: '',
    //   title_lowercase: '',
    //   description: '',
    //   website: '',
    //   indexed: false,
    //   includeDescriptionInDetailPage: false,
    //   includeImagesInDetailPage: false,
    //   includeTagsInDetailPage: false,
    //   lastUpdateDate: firebase.firestore.FieldValue.serverTimestamp(),
    //   creationDate: firebase.firestore.FieldValue.serverTimestamp()
    // };

    this.route.queryParams.subscribe(async (params: Params) => {
      // if (params['serviceId']){
      //   console.log('params ' + params['serviceId']);
      // }
      // else {
      //   console.log('no serviceId param');
      // }
      await this.loading.dismiss();
    });
  }

  async saveChanges () {
    if (this.forumGroup.status != 'VALID') {
      // exclude payment search controls
      if (!(this.forumGroup.get('searchStartAmount').hasError('pattern') ||
        this.forumGroup.get('searchStartAmount').hasError('min') ||
        this.forumGroup.get('searchStartAmount').hasError('max') ||
        this.forumGroup.get('searchEndAmount').hasError('pattern') ||
        this.forumGroup.get('searchEndAmount').hasError('min') ||
        this.forumGroup.get('searchEndAmount').hasError('max') ||
        this.forumGroup.errors?.range)) {
          console.log('form is not valid, cannot save to database');
          setTimeout(() => {
            for (let i in this.forumGroup.controls) {
              this.forumGroup.controls[i].markAsTouched();
            }

            if (this.forumGroup.get('title').hasError('required') || this.forumGroup.get('title').hasError('pattern'))
              this.titleRef.setFocus();
          }, 500);
          return;
      }
    }
  }

  async reset(){
    this.forumGroup.reset();
    this.forumGroup.get('indexed').setValue(false);
    this.forumGroup.get('type').setValue('Private');
    this.forumGroup.get('searchPaymentType').setValue('Any');
    this.forumGroup.get('searchCurrency').setValue('NZD');
    this.forumGroup.get('searchStartAmount').setValue(1);
    this.forumGroup.get('searchEndAmount').setValue(10);
    this.forumGroup.get('searchPrivateServices').setValue(this.searchPrivateServices);
    this.forumGroup.get('searchServiceIncludeTagsInSearch').setValue(this.searchServiceIncludeTagsInSearch);
  }
}
