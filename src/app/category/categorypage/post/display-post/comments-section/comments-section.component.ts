import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.css', '../display-post.component.css']
})
export class CommentsSectionComponent implements OnInit {
  @Input() postId: string;
  @Input() categoryId: string;
  @Input() comment: any;
  comments = [];

  constructor(private firebaseService: FirebaseService, public authService: AuthService) { }

  ngOnChanges(changes: SimpleChanges){
    if(changes.comment != null){
      this.comments.unshift(changes.comment.currentValue);
    }
  }

  ngOnInit() {
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
