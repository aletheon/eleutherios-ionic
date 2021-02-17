import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import {
  User
} from '../models';

import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<any>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private navCtrl: NavController) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  signIn(credentials): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password)).pipe(
      switchMap(user => {
        console.log('real user: ', user);
        if (user) {
          return this.db.doc(`users/${user.user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  signUp(credentials) {
    return this.afAuth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(result => {
      console.log('after register: ', result);

      const data: User = {
        uid: result.user.uid,
        email: credentials.email,
        displayName: credentials.name,
        photoUrl: result.user.photoURL,
        username: result.user.uid.substring(0,20),
        website: '',
        stripeCustomerId: '',
        stripeAccountId: '',
        stripeOnboardingStatus: '',
        stripeCurrency: '',
        fcmToken: '',
        receivePushNotifications: false,
        receiveForumAlertNotifications: false,
        receiveServiceAlertNotifications: false,
        receiveForumPostNotifications: false,
        receiveAlphaNotification: false,
        creationDate: firebase.firestore.FieldValue.serverTimestamp(),
        lastUpdateDate: firebase.firestore.FieldValue.serverTimestamp()
      };
      return this.db.doc(`users/${result.user.uid}`).set(data);
    });
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      this.navCtrl.navigateRoot('/login');
    });
  }
}
