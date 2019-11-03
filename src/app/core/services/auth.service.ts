import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router, ActivatedRoute } from  "@angular/router";
import { User } from  'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  
  constructor(public afAuth: AngularFireAuth, public router: Router, private route: ActivatedRoute) {
    this.afAuth.authState.subscribe(user => {
      this.user = user;
      if (user && user.emailVerified) {
        localStorage.setItem('user', JSON.stringify(this.user));
      }
      else{
        localStorage.setItem('user', null);
      }
    });
  }

  sendEmailVerification(){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.currentUser.sendEmailVerification().then(() => {
        resolve('Email sent');
      })
      .catch(error => {
        reject(error);
        console.log(error);
      });
    });
  }

  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        res.user.updateProfile({
          displayName: value.username
        })
        .then(() => {
          this.sendEmailVerification()
          .then(res => resolve({message: res}))
          .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
      }).catch(error => {
        reject(error);
      });
    });
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        if(res.user.emailVerified === true){
          this.router.navigate(['/']);
        }
        else{
          reject({message: "User not verified"});
        }
      }).catch(error => {
        reject(error);
        console.log(error);
      });
    });
  }

  doUpdateUser(values){
    return new Promise<any>((resolve, reject) => {
      this.user.updateProfile({
        displayName: values.displayName,
        photoURL: values.photoURL
      }).then(() => {
        resolve('success');
      }).catch(error => {
        reject(error);
      });
    });
  }

  logout(){
    this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/']);
    }).catch(error => {
      console.log(error);
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }
}
