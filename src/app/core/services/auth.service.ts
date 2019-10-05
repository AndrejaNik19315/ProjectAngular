import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router, ActivatedRoute } from  "@angular/router";
import { User } from  'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  
   constructor(public afAuth: AngularFireAuth, public router: Router, private route: ActivatedRoute) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    });
   }

  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        res.user.updateProfile({
          displayName: value.username
        });
        resolve(res);
      }).catch(function(error){
        reject(error)
      });
    });
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
        this.router.navigate(['/']);
      }, err => reject(err));
    });
  }

  doUpdateUser(values){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().currentUser.updateProfile({
        displayName: values.displayName,
        photoURL: values.photoURL
      }).then(function(){
        resolve("success");
      }).catch(error => reject(error));
    });
  }

  async logout(){
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }
}
