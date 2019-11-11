import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css', '../display-post.component.css']
})
export class CommentBoxComponent implements OnInit {
  commentForm: FormGroup;
  errorMessage: string;
  successMessage: string;

  constructor() { }

  ngOnInit() {
    this.commentForm = new FormGroup({
      'comment': new FormControl(null, [
        Validators.required
      ])
    });
  }

  tryComment(values){
    console.log(values);
  }

}
