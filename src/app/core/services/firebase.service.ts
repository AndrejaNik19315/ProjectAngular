import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

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
}
