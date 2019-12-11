import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IPopupModal } from 'src/app/shared/interfaces/popup-modal';

@Component({
  selector: 'app-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.css', '../display-post.component.css', '../../../../../shared/components/modal.css'],
  encapsulation: ViewEncapsulation.None
})
export class CommentsSectionComponent implements OnInit, IPopupModal {
  modalRef: BsModalRef;
  template: TemplateRef<any>;

  popupTitle: string = "Delete Comment";
  popupDescription: string = "This action cannot be reverted, are you sure you wish to proceed?";

  commentUid: string;
  commentId: string;
  
  @Input() postId: string;
  @Input() categoryId: string;
  comment: any;
  @Output() comments = [];

  @Output() editCommentEvent = new EventEmitter<any>();
  @Output() sendCommentsEvent = new EventEmitter<any>();

  constructor(private firebaseService: FirebaseService, public authService: AuthService, private modalService: BsModalService) {}

  ngOnInit() {
    this.getPostComments();
  }

  editComment(comment) {
    comment.flag = true;
    this.editCommentEvent.emit(comment);
  }

  openModal(template: TemplateRef<any>, commentUid, commentId) {
    this.modalRef = this.modalService.show(template);
    this.commentUid = commentUid;
    this.commentId = commentId;
  }

  tryRemoveComment() {
    this.modalRef.hide();
    let commentIndex = this.comments.findIndex(comment => comment.commentId === this.commentId);
    let elements = document.getElementsByClassName('comments')[0];
    let element = elements.getElementsByClassName('comment')[commentIndex];
    if(this.commentUid === this.authService.user.uid && commentIndex != null){
    this.firebaseService.deleteComment(this.categoryId, this.postId, this.commentId)
    .then(() => {
        elements.removeChild(element);
        this.comments.splice(commentIndex, 1);
    })
    .catch(error => {console.log(error)});
    }
  }

  getPostComments() {
    this.firebaseService.getPostComments(this.categoryId, this.postId)
    .then(result => {
      for(let i = 0; i < result.length; i++) {
        this.comment = {uid: result[i].payload.doc.data().uid, comment: result[i].payload.doc.data().comment, createdAt:  result[i].payload.doc.data().createdAt, commentId: result[i].payload.doc.id};
        this.comments.push(this.comment);
        this.firebaseService.getUser(this.comments[i].uid).then(result => {
          this.comments[i].displayName = result[0].payload.doc.data().displayName;
          this.comments[i].photoURL = result[0].payload.doc.data().photoURL;
        });
      }
  }).then(() =>  this.sendCommentsEvent.emit(this.comments)); //sending comments to parent component
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
