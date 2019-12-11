import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  postForm: FormGroup;
  file: File | null = null;
  photoURL = null;
  errorMessage: string;
  @Input() categoryId: string;
  @Input() post: any;
  
  constructor(private firebaseService: FirebaseService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.postForm = new FormGroup({
      'postTitle' : new FormControl(null, [Validators.required, Validators.maxLength(32), this.whitespaceValidator]),
      'postImage': new FormControl(this.file, [this.allowedFileType(['png','jpeg','jpg'])]),
      'postDescription': new FormControl(null, [Validators.required, Validators.maxLength(512), this.whitespaceValidator])
    });
  }

    //Custom validators
    whitespaceValidator(control: FormControl) {
      let value = control.value;
      if(value != null){
        if(value.trim() !== ""){
          return null;
        }
        else{
          return {value: true};
        }
      }
    }
  
    allowedFileType( types: string[] ) {
      return function (control: FormControl) {
        let file = control.value;
        if ( file != null ) {
          let flag = {badFileType: true};
          let extension = file.split('.')[1].toLowerCase();
          types.forEach(type => {
            if ( type.toLowerCase() === extension.toLowerCase() ) {
              flag = null;
            }
          });
          return flag;
        }
        return null;
      };
    }

}
