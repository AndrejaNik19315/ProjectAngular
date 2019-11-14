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
    //time passed in seconds
    let timeDiff = Math.round(new Date(Math.abs(new Date().getTime() - timestamp.getTime())).getTime() / 1000); 
    let timeString;

    if(timeDiff === 1){
      timeString = "Just now";
    }
    if(timeDiff > 1 && timeDiff < 60){
      timeString = timeDiff + " seconds ago";
    }
    if(timeDiff >= 60 && timeDiff < 120){
      timeString = "1 minute ago";
    }
    if(timeDiff >= 120 && timeDiff < 3600){
      timeString = Math.round(timeDiff / 60) + " minutes ago";
    }
    if(timeDiff >= 3600 && timeDiff < 7200){
      timeString = "1 hour ago";
    }
    if(timeDiff >= 7200 && timeDiff < 86400){
      timeString = Math.round(timeDiff / 3600) + " hours ago";
    }
    if(timeDiff >= 86400 && timeDiff < 172800){
      timeString =  "1 day ago";
    }
    if(timeDiff >= 172800 && timeDiff < 604800){
      timeString = Math.round(timeDiff / 86400) + " days ago";
    }
    if(timeDiff >= 604800 && timeDiff < 1209600){
      timeString ="1 week ago";
    }
    if(timeDiff >= 1209600 && timeDiff < 2629743.83){
      timeString = Math.round(timeDiff / 604800) + " weeks ago";
    }
    if(timeDiff >= 2629743.83 && 5259487.66){
      timeString = "1 month ago";
    }
    if(timeDiff >= 5259487.66 && timeDiff < 31556926){
      timeString = Math.round(timeDiff / 2629743.83)+" months ago";
    }
    if(timeDiff >= 31556926 && timeDiff < 63113851.9){
      timeString = "1 year ago"
    }
    if(timeDiff >= 63113851.9){
      timeString = "More than an year ago";
    }

    return timeString;
  }

}
