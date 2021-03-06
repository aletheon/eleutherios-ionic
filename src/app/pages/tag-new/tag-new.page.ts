import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController, IonInput } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import * as _ from "lodash";

import {
  AuthService,
  UserTagService,
  TagService
} from '../../services';
import {
  Tag
} from '../../models';

@Component({
  selector: 'app-tag-new',
  templateUrl: './tag-new.page.html',
  styleUrls: ['./tag-new.page.scss'],
})
export class TagNewPage implements OnInit {
  @ViewChild('submitButton', { static: false }) submitButtonRef: IonInput;

  public tagGroup: FormGroup;
  public loading: HTMLIonLoadingElement;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private userTagService: UserTagService,
    private tagService: TagService,
    private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.tagGroup = this.fb.group({
      tagId:                              [''],
      uid:                                [''],
      tag:                                ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s]*$/)]],
      lastUpdateDate:                     [''],
      creationDate:                       ['']
    });
  }

  async saveChanges () {
    if (this.tagGroup.status != 'VALID'){
      this.submitButtonRef.disabled = false;
      return;
    }

    this.tagService.exists(this.tagGroup.get('tag').value).then(exists => {
      if (!exists){
        // Create tag
        let newTag: Tag = {
          tagId: '',
          uid: this.auth.uid,
          tag: this.tagGroup.get('tag').value.toLowerCase(),
          lastUpdateDate: firebase.firestore.FieldValue.serverTimestamp(),
          creationDate: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Add tag
        this.userTagService.create(this.auth.uid, newTag).then(() => {
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
        this.showError(`<center>Tag with name '${this.tagGroup.get('tag').value}' already exists</center>`).then(() => {
          this.submitButtonRef.disabled = false;
        });
      }
    })
    .catch(error => {
      this.submitButtonRef.disabled = false;
      console.error(error);
    });
  }

  async showSuccess() {
    const toast = await this.toastCtrl.create({
      duration: 3000,
      message: `<center>Successfully created tag '${ this.tagGroup.get('tag').value }'</center>`,
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
