import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.css', '../display-post.component.css']
})
export class CommentsSectionComponent implements OnInit {
  postId: string;
  categoryId: string;
  categoryPath: string;
  comments = [];

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService, public authService: AuthService) { }

  ngOnInit() {
    this.postId = this.route.snapshot.params.postId;
    this.categoryPath = 'category/' + this.route.snapshot.params.name;

    this.firebaseService.getCategory(this.categoryPath).then(result => {
      this.categoryId = result[0].payload.doc.id;
    }).then(() => {
      this.firebaseService.getPostComments(this.categoryId, this.postId)
      .then(result => {
        for(let i = 0; i < result.length; i++) {
          this.comments.push(result[i].payload.doc.data());
          this.firebaseService.getUser(this.comments[i].uid).then(result => {
            this.comments[i].displayName = result[0].payload.doc.data().displayName;
            this.comments[i].photoURL = result[0].payload.doc.data().photoURL;
          });
        }
      });
    })
  }

  timeElapsed(timestamp: Date){
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
