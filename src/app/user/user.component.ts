import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../core/services/firebase.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user'));
  dateJoined: Date = new Date(parseInt(this.user.createdAt));
  uidCheck: any = this.route.snapshot.params.uid;

  constructor(private titleService: Title, private route: ActivatedRoute, private firebaseService: FirebaseService) {
    this.titleService.setTitle('Divinity - User Info');
  }

   ngOnInit() {
    if(this.uidCheck !== this.user.uid){
      this.user = this.findUser().then(result => {
        this.user.displayName = result.displayName;
        this.user.email = result.email;
        this.user.photoURL = result.photoURL;
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
