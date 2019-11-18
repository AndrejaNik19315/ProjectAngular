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
getCategoryPosts(categoryId){
  return new Promise<any>((resolve, reject) => {
    this.db.collection('categories').doc(categoryId).collection('posts').snapshotChanges()
    .subscribe(
      (response) => resolve(response),
      (error) => reject(error)
    );
  });
}

getCategoryPost(categoryId, postId){
  return new Promise<any>((resolve, reject) => {
    this.db.collection('categories').doc(categoryId).collection('posts').doc(postId).snapshotChanges()
    .subscribe(
      (response) => resolve(response),
      (error) => reject(error)
    );
  });
}

//POST
postCategoryPost(categoryId, values){
  return new Promise<any>((resovle, reject) => {
    this.db.collection('categories').doc(categoryId).collection('posts').add({
      createdAt: new Date(),
      description: values.postDescription,
      postPhotoURL: values.postImage,
      title: values.postTitle,
      uid: values.uid
    })
    .then(res => resovle(res))
    .catch(error => reject(error));
  });
}

//Comments
//GET
getPostComments(categoryId, postId){
  return new Promise<any>((resovle, reject) => {
    this.db.collection('categories').doc(categoryId).collection('posts').doc(postId).collection('comments', ref => ref.orderBy('createdAt', 'desc')).snapshotChanges()
    .subscribe(
      (response) => resovle(response),
      (error) => reject(error)
    );
  });
}

//POST
postComment(categoryId, postId, values){
  return new Promise<any>((resolve,reject) => {
    this.db.collection('categories').doc(categoryId).collection('posts').doc(postId).collection('comments').add({
      comment: values.comment,
      createdAt: new Date(),
      uid: values.uid
    })
    .then(res => resolve(res))
    .catch(error => reject(error));
  });
}

//DELETE

//STORAGE

//Images
  //UPLOAD
  uploadImage(storagePath: string, event: File){
      const file = event;
      let path = storagePath + "/" + new Date().getTime() + "_" + file.name;
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