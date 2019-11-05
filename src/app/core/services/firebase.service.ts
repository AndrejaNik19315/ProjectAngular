import { Injectable } from '@angular/core';
import { AngularFirestore, fromDocRef } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { resolve, reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { }

  //FIRESTORE

  //Categories
  //GET
  getCategories(){
    return new Promise<any>((resolve, reject) => {
      this.db.collection('categories').snapshotChanges()
      .subscribe(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }

  getCategory(categoryPath){
    return new Promise<any>((resolve, reject) => {
      this.db.collection('categories', ref => ref.where('url_path', '==', categoryPath).limit(1)).snapshotChanges().subscribe(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }

//Users
  //GET
  async getUsers(){
   return await new Promise<any>((resolve, reject) => {
      this.db.collection('users').snapshotChanges()
      .subscribe(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }

  getUser(uid){
    return new Promise<any>((resolve, reject) => {
      this.db.collection('users', ref => ref.where('uid', '==', uid).limit(1))
      .snapshotChanges()
      .subscribe(
        (response) => resolve(response),
        (error) => reject(error)
      )
    });
  }

  //POST
  insertUser(values){
    return new Promise<any>((resolve,reject) => {
      this.db.collection('users').add({
        uid: values.uid,
        createdAt: parseInt(values.createdAt),
        displayName: values.displayName,
        email: values.email,
        photoURL: ''
      })
      .then(res => resolve(res))
      .catch(error => reject(error));
    });
  }

  //UPDATE
  async updateUser(values){
    let user = await this.getUser(values.uid);
    return await new Promise<any>((resolve, reject) => {
      this.db.collection('users').doc(user[0].payload.doc.id).update(values)
      .then(success => {
        resolve("Update successful");
      })
      .catch(error => {
        reject(error.message);
      });
    });
  }

  //DELETE
  removeUser(){
    //logic
  }

//Posts
//GET
getCategoryPosts(categoryUid){
  return new Promise<any>((resolve, reject) => {
    this.db.collection('categories').doc(categoryUid).collection('posts').snapshotChanges()
    .subscribe(
      (response) => resolve(response),
      (error) => reject(error)
    );
  });
}

//STORAGE

//Images
  //UPLOAD
  uploadImage(event: File){
      const file = event;
      let path = "userAvatars/" + new Date().getTime() + "_" + file.name;
      return this.storage.upload(path, file)
      .then(res => res.ref.getDownloadURL())
      .catch(error => error.message);
  }
  
  //REMOVE
  removeImage(imageURL: string){
    return this.storage.storage.refFromURL(imageURL).delete()
    .then(res => res)
    .catch(error => error);
  }
}