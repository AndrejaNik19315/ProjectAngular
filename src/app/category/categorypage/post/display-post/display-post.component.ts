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
      });

    this.getPostData(this.categoryPath, this.route.snapshot.params.postId);
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  async getPostData(categoryPath, postId){
    await this.firebaseService.getCategory(categoryPath).then(result => {
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

    let comment = document.createElement('div');
    let userSection = document.createElement('div');
    let userComment = document.createElement('div')
    document.getElementsByClassName('comments')[0].appendChild(comment.appendChild(document.createElement("div"))).classList.add("comment");
  }

  timePassed(timestamp: Date){
    let timeDiff = new Date(Math.abs(new Date().getTime() - timestamp.getTime()));
    let time;

    if(timeDiff.getUTCSeconds() == 1){
      time = "1 second ago";
    }
    if(timeDiff.getUTCSeconds() > 1 && timeDiff.getUTCMinutes() < 1){
      time = timeDiff.getUTCSeconds() + " seconds ago";
    }
    if(timeDiff.getUTCMinutes() >= 1 && timeDiff.getUTCMinutes() < 2){
      time = timeDiff.getUTCMinutes() + " minute ago";
    }
    if(timeDiff.getUTCMinutes() >= 2 && timeDiff.getUTCHours() < 1){
      time = timeDiff.getMinutes() + " minutes ago";
    }
    if(timeDiff.getUTCHours() >= 1 && timeDiff.getUTCHours() < 2){
      time = timeDiff.getUTCHours() + " hour ago";
    }
    if(timeDiff.getUTCHours() >= 2 && timeDiff.getUTCDate() < 1){
      time = timeDiff.getUTCHours() + " hours ago";
    }
    if(timeDiff.getUTCDate() == 1){
      time = timeDiff.getUTCDate() + " day ago";
    }
    if(timeDiff.getUTCDate() >= 2 && timeDiff.getUTCMonth() < 1){
      time = timeDiff.getDate() + " days ago";
    }
    if(timeDiff.getUTCMonth() == 1){
      time = timeDiff.getUTCMonth() + " month ago";
    }
    if(timeDiff.getUTCMonth() >= 1 && timeDiff.getUTCMonth() < 12){
      time = timeDiff.getUTCMonth() + " months ago";
    }
    if(timeDiff.getUTCMonth() == 12){
      time = "1 year ago";
    }
    if(timeDiff.getUTCMonth() >= 12){
      time = "more than an year ago";
    }

    return time;
  }

}
