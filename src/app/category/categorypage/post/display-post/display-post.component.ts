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
  user: any = JSON.parse(localStorage.getItem('user'));

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

    //prepare data
    values.uid = this.user.uid;
    values.photoURL = this.user.photoURL;
    values.username = this.user.displayName;
    //write
    this.firebaseService.postComment(this.categoryId, this.route.snapshot.params.postId, values)
    .then(result => {
      console.log(result);
      let comment = document.createElement('div');
      comment.innerHTML = "<div class='user-section'><a href='user/"+this.user.uid+"'><img style='width: 40px; height: 40px; padding: 2px; margin: 5px; border: 1px solid #d62222;' src='"+this.user.photoURL+"' alt='userAvatar.jpg'/>"+this.user.displayName+"</a><span class='text-muted'> Just now</span></div><div class='p-3' style='overflow: hidden; border-bottom: 1px solid rgba(0, 0, 0, 0.125);'>"+values.comment+"</div>";
      document.getElementsByClassName('comments')[0].prepend(comment);
      comment.className = 'comment';
    })
    .catch(error => console.log(error));

  }

  timePassed(timestamp: Date){
    let timeDiff = new Date(Math.abs(new Date().getTime() - timestamp.getTime()));
    let time;

    if(timeDiff.getSeconds() == 1){
      time = "1 second ago";
    }
    if(timeDiff.getSeconds() > 1 && timeDiff.getMinutes() < 1){
      time = timeDiff.getSeconds() + " seconds ago";
    }
    if(timeDiff.getMinutes() >= 1 && timeDiff.getMinutes() < 2){
      time = timeDiff.getMinutes() + " minute ago";
    }
    if(timeDiff.getMinutes() >= 2 && timeDiff.getMinutes() < 60){
      time = timeDiff.getMinutes() + " minutes ago";
    }
    if(timeDiff.getHours() == 1 && timeDiff.getHours() < 2){
      time = timeDiff.getHours() + " hour ago";
    }
    if(timeDiff.getHours() >= 2 && timeDiff.getDate() < 1){
      time = timeDiff.getHours() + " hours ago";
    }
    if(timeDiff.getDate() == 1){
      time = timeDiff.getDate() + " day ago";
    }
    if(timeDiff.getDate() >= 2 && timeDiff.getMonth() < 1){
      time = timeDiff.getDate() + " days ago";
    }
    if(timeDiff.getMonth() == 1){
      time = timeDiff.getMonth() + " month ago";
    }
    if(timeDiff.getMonth() >= 1 && timeDiff.getMonth() < 12){
      time = timeDiff.getMonth() + " months ago";
    }
    if(timeDiff.getMonth() == 12){
      time = "1 year ago";
    }
    if(timeDiff.getMonth() >= 12){
      time = "more than an year ago";
    }

    return time;
  }

}
