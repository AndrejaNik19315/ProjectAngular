import { Injectable } from '@angular/core';
import { AngularFirestore, fromDocRef } from 'angularfire2/firestore';
import { AngularFireStorage  } from 'angularfire2/storage';
import { reject, resolve } from 'q';
import { snapshotChanges } from 'angularfire2/database';
import { findLast } from '@angular/compiler/src/directive_resolver';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
 
  constructor(private db: AngularFirestore, private storage: AngularFireStorage ) { }

  getCategories(){
    return new Promise<any>((resolve, reject) => {
      this.db.collection('categories').snapshotChanges()
      .subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

  //Users

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

  async updateUser(values){
    let flag = true;
    let user = this.db.collection('users', ref => ref.where('uid', '==', values.uid).limit(1));
  }

  removeUser(){
    //logic
  }


//Images
  async uploadImage(file){
    let path = "userImages/" + new Date().getTime() + "_" + file.name;
    let task = this.storage.upload(path, file);
    return task;
  }
}
