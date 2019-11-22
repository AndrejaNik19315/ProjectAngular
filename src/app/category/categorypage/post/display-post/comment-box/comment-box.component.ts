import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css', '../display-post.component.css']
})
export class CommentBoxComponent implements OnInit {
  commentForm: FormGroup;
  errorMessage: string;
  @Input() categoryId: string;
  @Input() postId: string;
  user: any;
  comment: any = {};

  @Output() commentEvent = new EventEmitter<any>();

  constructor(private firebaseService: FirebaseService, public authService: AuthService) { 
    this.user = authService.user;
  }

  ngOnInit() {
    this.commentForm = new FormGroup({
      'comment' : new FormControl(null, [Validators.required, Validators.maxLength(256)])
    }, this.whitespaceValidator);
  }

  tryComment(values){
    if(this.commentForm.valid){
    this.errorMessage = null;
    //prepare data
    values.uid = this.user.uid;
    //write
    this.firebaseService.postComment(this.categoryId, this.postId, values)
    .then(() => {
      this.comment.uid = values.uid;
      this.comment.displayName = this.user.displayName;
      this.comment.comment = values.comment;
      this.comment.createdAt = null;
      this.comment.photoURL = this.user.photoURL ? this.user.photoURL : null;

      this.commentEvent.emit(this.comment);

      document.getElementsByTagName("input")[1].click();
    })
    .catch(error => console.log(error));
    }
    else{
      this.errorMessage = "Comment is invalid.";
    }
  }

  whitespaceValidator(control: FormControl){
    let comment = control.get('comment');
    if(comment.value != null){
      if(comment.value.trim() !== ""){
        return null;
      }
      else{
        return {comment: true};
      }
    }
  }

}
