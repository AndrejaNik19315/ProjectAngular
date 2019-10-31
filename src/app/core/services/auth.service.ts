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
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      }
      else{
        localStorage.setItem('user', null);
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
      }).catch(error => {
        reject(error);
      });
    });
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
        this.router.navigate(['/']);
      }).catch(error => {
        reject(error);
      });
    });
  }

  doUpdateUser(values){
    return new Promise<any>((resolve, reject) => {
      this.user.updateProfile({
        displayName: values.displayName,
        photoURL: values.photoURL
      }).then(success => {
        resolve('success');
      }).catch(error => {
        reject(error);
      });
    });
  }

  logout(){
    this.afAuth.auth.signOut().then(res => {
      console.log(res);
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
