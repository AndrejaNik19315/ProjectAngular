import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { stringify } from 'querystring';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['../create-post/create-post.component.css']
})
export class EditPostComponent implements OnInit {
  postForm: FormGroup;
  file: File | null = null;
  photoURL = null;
  errorMessage: string;
  @Input() categoryId: string;
  @Input() post: any;

  @Output() postEditEvent = new EventEmitter<any>();
  @Output() cancelEditEvent = new EventEmitter<any>();

  @HostListener('change', ['$event.target.files']) emitFile( event: File ) {
    if(event != null){
      const file = event[0];
      this.file = file;
    }
  }

  constructor(private firebaseService: FirebaseService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.postForm = new FormGroup({
      'postTitle' : new FormControl(null, [Validators.required, Validators.maxLength(32), this.whitespaceValidator]),
      'postImage': new FormControl(this.file, [this.allowedFileType(['png','jpeg','jpg'])]),
      'postDescription': new FormControl(null, [Validators.required, Validators.maxLength(512), this.whitespaceValidator])
    });
  }

  async tryUpdatePost(values) {
    console.log(this.post);
    let updateValues: any = {};
    updateValues.description = values.postDescription;
    updateValues.title = values.postTitle;

    if(this.postForm.valid) {

      this.errorMessage = null;
      let flag = true;
      this.spinner.show();

      if(values.postImage !== null) {
        await this.firebaseService.removeImage(this.post.postPhotoURL)
        .catch(error => {
          console.log(error);
          flag = false;
          this.errorMessage = "Something went wrong while updating.";
        });
      }

      if(this.file !== null) {
        let storagePath = "postImages";
        await this.firebaseService.uploadImage(storagePath, this.file)
        .then(res => {
          values.postPhotoURL = res.split('&')[0];
          updateValues.postPhotoURL = values.postPhotoURL;
        })
        .catch(error => {
          flag = false;
          this.errorMessage = error;
        });
      }

      this.firebaseService.updateCategoryPost(this.categoryId, this.post.pid, updateValues)
      .then(res => {
        console.log(res);
        this.post.description = updateValues.description;
        this.post.title = updateValues.title;
        this.post.postPhotoURL = updateValues.postPhotoURL !== null ? updateValues.postPhotoURL : this.post.postPhotoURL;
        this.postEditEvent.emit(this.post);
        this.post = {};
        document.getElementsByTagName("input")[3].click();
      })
      .catch(error => {
        console.log(error);
        this.errorMessage = error;
      });

    }
    else {
      this.errorMessage = "Invalid Post format.";
    }
    this.spinner.hide();
  }

  cancelUpdatePost(post){
    post.flag = false;
    this.cancelEditEvent.emit(post);
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
