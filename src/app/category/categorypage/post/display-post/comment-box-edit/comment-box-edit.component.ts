import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';

@Component({
  selector: 'app-comment-box-edit',
  templateUrl: './comment-box-edit.component.html',
  styleUrls: ['./comment-box-edit.component.css', '../comment-box/comment-box.component.css']
})
export class CommentBoxEditComponent implements OnInit {
  commentForm: FormGroup;
  errorMessage: string;
  @Input() comment: any;
  @Input() categoryId: string;
  @Input() postId: string;
  
  //@Output() commentEditEvent = new EventEmitter<any>();
  @Output() cancelEditEvent = new EventEmitter<any>();

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.commentForm = new FormGroup({
      'comment' : new FormControl(null, [Validators.required, Validators.maxLength(256)])
    }, this.whitespaceValidator);
  }

  tryUpdateComment(value) {
    if(this.commentForm.valid) {
      this.errorMessage = null;
      this.firebaseService.updatePostComment(this.categoryId, this.postId, this.comment.commentId, value)
      .then(() => {
        this.comment.comment = value.comment;
        document.getElementsByTagName("input")[1].click();
      })
      .catch(error => console.log(error))
    }
    else{
      this.errorMessage = "Comment is out of format";
    }
  }

  cancelUpdateComment(comment) {
    comment.flag = false;
    this.cancelEditEvent.emit(comment);
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
