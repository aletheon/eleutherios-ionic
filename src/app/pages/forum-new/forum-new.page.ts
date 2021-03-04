import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastController, IonInput } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { IonicSelectableComponent } from 'ionic-selectable';
import firebase from 'firebase/app';

import * as _ from "lodash";
import {
  AuthService,
  UserForumTagService,
  TagService,
  UserForumService
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
  private _selectedTags: Tag[] = [];

  public forumGroup: FormGroup;
  public searchPrivateServices: boolean = false;
  public searchServiceIncludeTagsInSearch: boolean = false;
  public loading: HTMLIonLoadingElement;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private userForumTagService: UserForumTagService,
    private tagService: TagService,
    private userForumService: UserForumService,
    private toastCtrl: ToastController) {
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
    this._selectedTags = [];
  }

  async ngOnInit() {
    this.searchPrivateServices = true;
    this.searchServiceIncludeTagsInSearch = true;

    this.forumGroup = this.fb.group({
      forumId:                            [''],
      uid:                                [''],
      parentId:                           [''],
      parentUid:                          [''],
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
    this.forumGroup.get('uid').setValue(this.auth.uid);
    this.forumGroup.get('parentId').setValue('');
    this.forumGroup.get('parentUid').setValue('');
    this.forumGroup.get('type').setValue('Private');
    this.forumGroup.get('description').setValue('');
    this.forumGroup.get('website').setValue('');
    this.forumGroup.get('indexed').setValue(false);
    this.forumGroup.get('includeDescriptionInDetailPage').setValue(false);
    this.forumGroup.get('includeImagesInDetailPage').setValue(false);
    this.forumGroup.get('includeTagsInDetailPage').setValue(false);
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
        uid: this.forumGroup.get('uid').value,
        parentId: this.forumGroup.get('parentId').value,
        parentUid: this.forumGroup.get('parentUid').value,
        type: this.forumGroup.get('type').value,
        title: tempTitle,
        title_lowercase: tempTitle.toLowerCase(),
        description: this.forumGroup.get('description').value.trim(),
        website: this.forumGroup.get('website').value.trim(),
        indexed: this.forumGroup.get('indexed').value,
        includeDescriptionInDetailPage: this.forumGroup.get('includeDescriptionInDetailPage').value,
        includeImagesInDetailPage: this.forumGroup.get('includeImagesInDetailPage').value,
        includeTagsInDetailPage: this.forumGroup.get('includeTagsInDetailPage').value,
        lastUpdateDate: firebase.firestore.FieldValue.serverTimestamp(),
        creationDate: firebase.firestore.FieldValue.serverTimestamp()
      };

      this.userForumService.create(this.forumGroup.get('uid').value, data).then(forumId => {
        if (this._selectedTags.length > 0){
          var promises = this._selectedTags.map(tag => {
            return new Promise<void>((resolve, reject) => {
              this.userForumTagService.exists(this.forumGroup.get('uid').value, forumId, tag.tagId).then(exists => {
                if (!exists){
                  this.userForumTagService.getTagCount(this.forumGroup.get('uid').value, forumId).then(count => {
                    if (count < 5){
                      this.userForumTagService.create(this.forumGroup.get('uid').value, forumId, tag)
                        .then(() => {
                          // delay to prevent user adding multiple tags simultaneously
                          setTimeout(() => {
                            resolve();
                          }, 1000);
                        }
                      )
                      .catch(error => {
                        reject(error);
                      });
                    }
                    else reject('This is the alpha version of eleutherios and is limited to only 5 tags per forum');
                  });
                }
              });
            });
          });

          Promise.all(promises).then(() => {
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
          this.showSuccess().then(() => {
            this.submitButtonRef.disabled = false;
          });
        }
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
