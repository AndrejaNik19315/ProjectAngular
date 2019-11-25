import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, HostListener, EventEmitter, Output, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  postForm: FormGroup;
  file: File | null = null;
  photoURL = null;
  errorMessage: string;
  @Input() categoryId: string;
  paramsSubscription: Subscription;
  user: any = JSON.parse(localStorage.getItem('user'));
  post: any = {};

  @Output() postEvent = new EventEmitter<any>();

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

  async tryPost(values){
    values.uid = this.user.uid;
    
    if(this.postForm.valid){
      this.errorMessage = null;
      let flag = true;
      this.spinner.show();
      if(this.file !== null){
        let storagePath = "postImages";
        await this.firebaseService.uploadImage(storagePath, this.file)
        .then(res => {
          values.postImage = res.split('&')[0];
        })
        .catch(error => {
          this.errorMessage = error;
          flag = false;
        });
      }
      this.firebaseService.postCategoryPost(this.categoryId, values)
      .then(res => {
        this.post.pid = res.id;
        this.post.uid = values.uid;
        this.post.displayName = this.user.displayName;
        this.post.title = values.postTitle;
        this.post.description = values.postDescription;
        this.post.postPhotoURL = values.postImage != null ? values.postImage : null;
        this.post.createdAt = null;

        this.postEvent.emit(this.post);

        this.post = {};

        document.getElementsByTagName("input")[3].click();
      })
      .catch(error => console.log(error));
    }
    else{
      this.errorMessage = "Invalid Post format.";
    }
    this.spinner.hide();
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
