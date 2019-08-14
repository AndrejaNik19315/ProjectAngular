import { Injectable } from '@angular/core';
import { AngularFirestore, fromDocRef } from 'angularfire2/firestore';
import { reject, resolve } from 'q';
import { snapshotChanges } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
 
  constructor(private db: AngularFirestore) { }

  getCategories(){
    return new Promise<any>((resolve, reject) => {
      this.db.collection('categories').snapshotChanges()
      .subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

  //REST Users

  async getUsers(){
   return await new Promise<any>((resolve, reject) => {
      this.db.collection('users').snapshotChanges()
      .subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

  getUser(uid){
    return new Promise<any>((resolve, reject) => {
      this.db.collection('users', ref => ref.where('uid', '==', uid).limit(1))
      .snapshotChanges()
      .subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

  insertUser(values){
      this.db.collection('users').add({
        uid: values.uid,
        createdAt: parseInt(values.createdAt),
        displayName: values.displayName,
        email: values.email,
        photoURL: ''
      })
      .then(function(docRef) {
        return docRef;
      })
      .catch(function(error){
        return error;
      });
  }

  updateUser(values){
    //logic
  }

  removeUser(){
    //logic
  }

  // getUser(uid){
  //   return new Promise<any>((resolve, reject) => {
  //     this.db.firestore.
  //   });
  // }
}
