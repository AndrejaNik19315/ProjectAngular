import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../core/services/firebase.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user'));
  dateJoined: Date = new Date(parseInt(this.user.createdAt));
  uidCheck: any = this.route.snapshot.params.uid;

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) { }

   ngOnInit() {
    if(this.uidCheck !== this.user.uid){
      this.user = this.findUser().then(result => {
        this.user.displayName = result.displayName;
        this.user.email = result.email;
        this.dateJoined = new Date(parseInt(result.createdAt));
      });
    }
  }

  async findUser(){
    let user;

    await this.firebaseService.getUser(this.uidCheck).then(result => {
      user = result;
    });

    return user[0].payload.doc.data();
  }

}
