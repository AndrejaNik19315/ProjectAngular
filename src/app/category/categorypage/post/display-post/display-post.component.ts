import { AuthService } from './../../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-display-post',
  templateUrl: './display-post.component.html',
  styleUrls: ['./display-post.component.css', '../../categorypage.component.css']
})
export class DisplayPostComponent implements OnInit {

  post: any;
  comments: any;
  categoryId: string;
  categoryPath: string;
  categoryName: string;
  commentForm: FormGroup;
  errorMessage: string;
  paramsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private titleService: Title, private firebaseService: FirebaseService, public authService: AuthService) {
    this.titleService.setTitle('Divinity - Post');
  }

  ngOnInit() {
    this.commentForm = new FormGroup({
      'comment': new FormControl(null, [
        Validators.required
      ])
    });

    this.paramsSubscription = this.route.params.subscribe(
      () => {
        this.categoryName = this.route.snapshot.params['name'].charAt(0).toUpperCase() + this.route.snapshot.params['name'].slice(1);
        this.categoryPath = 'category/' + this.route.snapshot.params.name;
        this.getPostData(this.categoryPath, this.route.snapshot.params.postId);
      });

  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  getPostData(categoryPath, postId){
    this.firebaseService.getCategory(categoryPath).then(result => {
      this.categoryId = result[0].payload.doc.id;
    }).then(() => {
      this.firebaseService.getCategoryPost(this.categoryId, postId)
      .then(result => {
        this.post = result;
        this.firebaseService.getCategoryPostComments(this.categoryId, this.route.snapshot.params.postId)
        .then(result => {
          this.comments = result;
        })
        .catch(error => console.log(error));
      }).catch(error => console.log(error));
    });
  }

  tryComment(values){
    console.log(values);
  }

  timePassed(timestamp){
    let currentTime = new Date().getTime();
    let subTime = new Date(currentTime - timestamp);
    let time;

    if(subTime.getSeconds() == 1){
      time = "1 second ago";
    }
    if(subTime.getSeconds() > 1 && subTime.getMinutes() < 1){
      time = subTime.getSeconds() + " seconds ago";
    }
    if(subTime.getMinutes() >= 1 && subTime.getMinutes() < 2){
      time = subTime.getMinutes() + " minute ago";
    }
    if(subTime.getMinutes() >= 2 && subTime.getHours() < 1){
      time = subTime.getMinutes() + " minutes ago";
    }
    if(subTime.getHours() >= 1 && subTime.getHours() < 2){
      time = subTime.getHours() + " hour ago";
    }
    if(subTime.getHours() >= 2 && subTime.getDay() < 1){
      time = subTime.getHours() + " hours ago";
    }
    if(subTime.getDay() == 1){
      time = subTime.getDay() + " day ago";
    }
    if(subTime.getDay() >= 2 && subTime.getMonth() < 1){
      time = subTime.getDay() + " days ago";
    }
    if(subTime.getMonth() == 1){
      time = subTime.getMonth() + " month ago";
    }
    if(subTime.getMonth() >= 1 && subTime.getMonth() < 12){
      time = subTime.getMonth() + " months ago";
    }
    if(subTime.getMonth() == 12){
      time = "1 year ago";
    }
    if(subTime.getMonth() >= 12){
      time = "more than an year ago";
    }

    return time;
  }

}
