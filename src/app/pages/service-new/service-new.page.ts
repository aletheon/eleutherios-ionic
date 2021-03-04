import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastController, IonInput } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { IonicSelectableComponent } from 'ionic-selectable';
import firebase from 'firebase/app';

import * as _ from "lodash";
import {
  AuthService,
  UserServiceTagService,
  TagService,
  UserServiceService
} from '../../services';
import {
  Service,
  Tag
} from '../../models';

@Component({
  selector: 'app-service-new',
  templateUrl: './service-new.page.html',
  styleUrls: ['./service-new.page.scss'],
})
export class ServiceNewPage implements OnInit, OnDestroy {
  @ViewChild('submitButton', { static: false }) submitButtonRef: IonInput;
  @ViewChild('mainTitle', { static: false }) titleRef: IonInput;

  private _searchTagsSubscription: Subscription;
  private _selectedTags: Tag[] = [];

  public serviceGroup: FormGroup;
  public searchPrivateServices: boolean = false;
  public searchServiceIncludeTagsInSearch: boolean = false;
  public loading: HTMLIonLoadingElement;

  constructor(private fb: FormBuilder,
    private auth: AuthService,
    private userServiceTagService: UserServiceTagService,
    private tagService: TagService,
    private userServiceService: UserServiceService,
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
    this.serviceGroup.reset();
    this.serviceGroup.get('uid').setValue(this.auth.uid);
    this.serviceGroup.get('type').setValue('Private');
    this.serviceGroup.get('description').setValue('');
    this.serviceGroup.get('website').setValue('');
    this.serviceGroup.get('default').setValue(false);
    this.serviceGroup.get('indexed').setValue(false);
    this.serviceGroup.get('rate').setValue(0);
    this.serviceGroup.get('paymentType').setValue('Free');
    this.serviceGroup.get('amount').setValue(0.50);
    this.serviceGroup.get('typeOfPayment').setValue('One-off');
    this.serviceGroup.get('paymentId').setValue('');
    this.serviceGroup.get('paymentUserId').setValue('');
    this.serviceGroup.get('includeDescriptionInDetailPage').setValue(false);
    this.serviceGroup.get('includeImagesInDetailPage').setValue(false);
    this.serviceGroup.get('includeTagsInDetailPage').setValue(false);
    this._selectedTags = [];

    const userSubscription = this.auth.user.subscribe(user => {
      userSubscription.unsubscribe();
      this.serviceGroup.get('currency').setValue(user.stripeCurrency && user.stripeCurrency.length > 0 ? user.stripeCurrency : 'usd');
    });
  }

  async ngOnInit() {
    this.searchPrivateServices = true;
    this.searchServiceIncludeTagsInSearch = true;

    this.serviceGroup = this.fb.group({
      serviceId:                          [''],
      uid:                                [''],
      type:                               [''],
      title:                              ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9._\s]*$/)]],
      title_lowercase:                    [''],
      description:                        [''],
      website:                            [''],
      default:                            [''],
      indexed:                            [''],
      rate:                               [''],
      paymentType:                        [''],
      amount:                             ['', [Validators.required, Validators.pattern(/^\s*-?\d+(\.\d{1,2})?\s*$/), Validators.min(0.50), Validators.max(999999.99)]],
      typeOfPayment:                      [''],
      currency:                           [''],
      paymentId:                          [''],
      paymentUserId:                      [''],
      includeDescriptionInDetailPage:     [''],
      includeImagesInDetailPage:          [''],
      includeTagsInDetailPage:            [''],
      tag:                                [''],
      lastUpdateDate:                     [''],
      creationDate:                       ['']
    });
  }

  async saveChanges () {
    if (this.serviceGroup.status != 'VALID'){
      this.submitButtonRef.disabled = false;
      return;
    }

    let tempTitle = this.serviceGroup.get('title').value.replace(/\s\s+/g,' ');

    if (tempTitle.length <= 100){
      const data: Service = {
        serviceId: '',
        uid: this.serviceGroup.get('uid').value,
        type: this.serviceGroup.get('type').value,
        title: tempTitle,
        title_lowercase: tempTitle.toLowerCase(),
        description: this.serviceGroup.get('description').value.trim(),
        website: this.serviceGroup.get('website').value.trim(),
        default: this.serviceGroup.get('default').value,
        indexed: this.serviceGroup.get('indexed').value,
        rate: this.serviceGroup.get('rate').value,
        paymentType: this.serviceGroup.get('paymentType').value,
        amount: this.serviceGroup.get('paymentType').value == 'Free' ? 0 : parseFloat(this.serviceGroup.get('amount').value),
        typeOfPayment: this.serviceGroup.get('typeOfPayment').value,
        currency: this.serviceGroup.get('currency').value,
        paymentId: this.serviceGroup.get('paymentId').value,
        paymentUserId: this.serviceGroup.get('paymentUserId').value,
        includeDescriptionInDetailPage: false,
        includeImagesInDetailPage: false,
        includeTagsInDetailPage: false,
        lastUpdateDate: firebase.firestore.FieldValue.serverTimestamp(),
        creationDate: firebase.firestore.FieldValue.serverTimestamp()
      };

      this.userServiceService.create(this.serviceGroup.get('uid').value, data).then(serviceId => {
        if (this._selectedTags.length > 0){
          var promises = this._selectedTags.map(tag => {
            return new Promise<void>((resolve, reject) => {
              this.userServiceTagService.exists(this.serviceGroup.get('uid').value, serviceId, tag.tagId).then(exists => {
                if (!exists){
                  this.userServiceTagService.getTagCount(this.serviceGroup.get('uid').value, serviceId).then(count => {
                    if (count < 5){
                      this.userServiceTagService.create(this.serviceGroup.get('uid').value, serviceId, tag)
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
      message: `<center>Successfully created service '${ this.serviceGroup.get('title').value }'</center>`,
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
