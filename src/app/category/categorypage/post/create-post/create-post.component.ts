import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, HostListener, EventEmitter, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
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
  catgeoryId: string;
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

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe( () => {
      this.firebaseService.getCategory("category/"+this.route.snapshot.params.name)
      .then(res => this.catgeoryId = res[0].payload.doc.id)
      .catch(error => console.log(error));
    });

    this.postForm = new FormGroup({
      'postTitle' : new FormControl(null, [Validators.required, Validators.maxLength(32), this.whitespaceValidator]),
      'postImage': new FormControl(this.file, [this.allowedFileType(['png','jpeg','jpg'])]),
      'postDescription': new FormControl(null, [Validators.required, Validators.maxLength(512), this.whitespaceValidator])
    });
  }

  tryPost(values){
    values.uid = this.user.uid;

    if(this.postForm.valid){
      this.errorMessage = null;
      let flag = true;
      this.spinner.show();
      if(this.file !== null){
        let storagePath = "postImages";
        this.firebaseService.uploadImage(storagePath, this.file)
        .then(res => {
          values.postImage = res.split('&')[0];
        })
        .catch(error => {
          this.errorMessage = error;
          flag = false;
        });
      }
      this.firebaseService.postCategoryPost(this.catgeoryId, values)
      .then(res => {
        console.log(res);
        this.post.pid = res.id;
        this.post.uid = values.uid;
        this.post.displayName = this.user.displayName;
        this.post.title = values.postTitle;
        this.post.description = values.postDescription;
        this.post.postPhotoURL = null;
        this.post.createdAt = null;

        this.postEvent.emit(this.post);

        // let post = document.createElement('div');
        // post.innerHTML = "<a href='"+this.route.snapshot.params.name+"/"+res.parent.id+"'><h3 class='card-title'>"+values.postTitle+"</h3></a><p class='card-text mt-2'>"+values.postDescription+"</p><hr/><div class='pl-2 pr-2 text-muted'>Posted just now <a href='user/"+this.user.uid+"'>"+this.user.displayName+"</a></div>";
        // document.getElementsByClassName('posts')[0].prepend(post);
        // post.className = "card-body";

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
