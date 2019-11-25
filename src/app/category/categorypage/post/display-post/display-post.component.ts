import { AuthService } from './../../../../core/services/auth.service';
import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FirebaseService } from 'src/app/core/services/firebase.service';

@Component({
  selector: 'app-display-post',
  templateUrl: './display-post.component.html',
  styleUrls: ['./display-post.component.css', '../../categorypage.component.css']
})
export class DisplayPostComponent implements OnInit {
  post: any;
  categoryId: string;
  categoryPath: string;
  categoryName: string;
  errorMessage: string;
  user: any = JSON.parse(localStorage.getItem('user'));
  postId: string;
  comments: any[] = [];
  comment: any;

  constructor(private route: ActivatedRoute, private titleService: Title, private firebaseService: FirebaseService, public authService: AuthService) {
    this.titleService.setTitle('Divinity - Post');
  }

  ngOnInit() {
    this.postId = this.route.snapshot.params.postId;
    this.categoryName = this.route.snapshot.params['name'].charAt(0).toUpperCase() + this.route.snapshot.params['name'].slice(1);
    this.categoryPath = 'category/' + this.route.snapshot.params.name;

    this.firebaseService.getCategory(this.categoryPath).then(result => {
      this.categoryId = result[0].payload.doc.id;
    }).then(() => {
      this.getPostData(this.categoryId, this.route.snapshot.params.postId)
    });
  }

  getPostData(categoryId, postId) {
    this.firebaseService.getCategoryPost(categoryId, postId)
    .then(result => {
      this.post = result.payload.data();
      this.firebaseService.getUser(this.post.uid).then(result => {
        this.post.displayName = result[0].payload.doc.data().displayName;
        this.post.userPhotoURL = result[0].payload.doc.data().photoURL;
      })
      .catch(error => console.log(error));
    }).catch(error => console.log(error));
  }

  recieveCommentsEvent($event){
    this.comments = $event;
  }

  commentEvent($event) {
    this.comment = $event;

    if(this.comment != null) {
      this.comments.unshift(this.comment);
      console.log(this.comments);
    }
  }
}
