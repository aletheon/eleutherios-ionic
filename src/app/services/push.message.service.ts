import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { BehaviorSubject } from 'rxjs'
import { User } from '../models'

import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class PushMessageService {

  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);

  constructor(private afs: AngularFirestore) { }

  // *********************************************************************
  // public methods
  // *********************************************************************
  public getPermission(userId?: string){
    Notification.requestPermission()
      .then(() => {
        return this.messaging.getToken();
      })
      .then(token => {
        if (userId){
          this.afs.collection('users').doc<User>(userId).ref.get().then(doc => {
            if (doc.exists){
              let data: User = doc.data();
              data.fcmToken = token;
              doc.ref.update(data);
            }
          })
          .catch(error => {
            console.log('error updating user ' + error);
          });
        }
      })
      .catch((error) => {
        // reset receivePushNotifications
        if (userId){
          this.afs.collection('users').doc<User>(userId).ref.get().then(doc => {
            if (doc.exists){
              let data = doc.data();
              data.fcmToken = '';
              data.receivePushNotifications = false;
              doc.ref.update(data);
            }
          })
          .catch(error => {
            console.log('error updating user ' + error);
          });
        }
      }
    );
  }

  public receiveMessage(){
    this.messaging.onMessage((payload) => {
      this.currentMessage.next(payload);
    });
  }
}
