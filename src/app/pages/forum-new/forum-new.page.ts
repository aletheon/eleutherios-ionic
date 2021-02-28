import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, IonInput } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-forum-new',
  templateUrl: './forum-new.page.html',
  styleUrls: ['./forum-new.page.scss'],
})
export class ForumNewPage implements OnInit, OnDestroy {
  @ViewChild('submitButton', { static: false }) submitButtonRef: IonInput;
  @ViewChild('mainTitle', { static: false }) titleRef: IonInput;

  private _searchTagsSubscription: Subscription;
  private _selectedTags: Tag[];

  public forumGroup: FormGroup;
  public searchPrivateServices: boolean = false;
  public searchServiceIncludeTagsInSearch: boolean = false;
  public loading: HTMLIonLoadingElement;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
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
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private router: Router) {
  }

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

  async ngOnDestroy () {
  }

  async ionViewWillLeave() {
  }

  async ionViewWillEnter() {
    this.forumGroup.reset();
    this.forumGroup.get('indexed').setValue(false);
    this.forumGroup.get('type').setValue('Private');
  }

  async ngOnInit() {
    this.searchPrivateServices = true;
    this.searchServiceIncludeTagsInSearch = true;

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
      tag:                                [''],
      lastUpdateDate:                     [''],
      creationDate:                       ['']
    });
    this.forumGroup.get('type').setValue('Private');
    this.forumGroup.get('indexed').setValue(false);
  }

  async saveChanges () {
    if (this.forumGroup.status != 'VALID'){
      this.submitButtonRef.disabled = false;
      return;
    }

    let tempTitle = this.forumGroup.get('title').value.replace(/\s\s+/g,' ');

    if (tempTitle.length <= 100){
      const data: Forum = {
        forumId: '',
        parentId: '',
        parentUid: '',
        uid: this.auth.uid,
        type: this.forumGroup.get('type').value,
        title: tempTitle,
        title_lowercase: tempTitle.toLowerCase(),
        description: this.forumGroup.get('description').value.trim(),
        website: this.forumGroup.get('website').value.trim(),
        indexed: this.forumGroup.get('indexed').value != undefined ? this.forumGroup.get('indexed').value : false,
        includeDescriptionInDetailPage: false,
        includeImagesInDetailPage: false,
        includeTagsInDetailPage: false,
        lastUpdateDate: firebase.firestore.FieldValue.serverTimestamp(),
        creationDate: firebase.firestore.FieldValue.serverTimestamp()
      };

      this.userForumService.create(this.auth.uid, data).then(() => {
        this.showSuccess().then(() => {
          this.submitButtonRef.disabled = false;
        });
      })
      .catch(error => {
        this.showError(`<center>${error}</center>`).then(() => {
          this.submitButtonRef.disabled = false;
        });
      });
    }
    else {
      this.showError(`<center>This is the alpha version of eleutherios and is limited to only 100 characters per title</center>`).then(() => {
        this.submitButtonRef.disabled = false;
      });
    }
  }

  async showSuccess() {
    const toast = await this.toastCtrl.create({
      duration: 3000,
      message: `<center>Successfully created forum '${ this.forumGroup.get('title').value }'</center>`,
      color: 'success'
    });
    toast.present();
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
