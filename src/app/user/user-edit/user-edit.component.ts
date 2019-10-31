import { FormGroup, Validators, FormControl, ControlValueAccessor } from '@angular/forms';
import { Component, OnInit, ElementRef, HostListener, Directive } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent implements OnInit {

  updateUserForm: FormGroup;
  user: any = JSON.parse(localStorage.getItem('user'));
  dateJoined: Date = new Date(parseInt(this.user.createdAt));

  file: File | null = null;
  imagePath = null;
  photoURL = null;
  imageURL = null;
  currentUserImage = this.user.providerData[0].photoURL;

  errorMessage: string;
  successMessage: string;

  @HostListener('change', ['$event.target.files']) emitFile( event: File ) {
    const file = event[0];
    this.file = file;
  }

  constructor(private titleService: Title, private authService: AuthService, private firebaseService: FirebaseService, private spinner: NgxSpinnerService) {
    this.titleService.setTitle('Divinity - User Update');
  }

  ngOnInit() {
    this.updateUserForm = new FormGroup({
      'displayName': new FormControl(this.user.displayName, [
        Validators.required,
        Validators.minLength(3)
      ]),
      'userAvatar' : new FormControl(this.file, [
        this.allowedFileType(['png','jpeg','jpg'])
      ])
    });
  }

  async tryUpdateUser(values){
    this.successMessage = null;
    this.errorMessage = null;
    this.spinner.show();
    let flag;

    await this.validation(values).then(result => {
      flag = result;
    });

    if(flag === true){
      //If image is set upload it
      if(this.file !== null){
        await this.firebaseService.uploadImage(this.file)
        .then(res => {
          this.photoURL = res.split('&')[0];
          values.photoURL = this.photoURL;
          //Remove previous image if there is one
          if(this.currentUserImage !== null){
            this.firebaseService.removeImage(this.currentUserImage)
            .catch(error => {
              console.log(error);
              this.successMessage = null;
              this.errorMessage = error.message;
              flag = false;
            });
          }
        })
        .catch(error => {
          this.successMessage = null;
          this.errorMessage = error;
          console.log(error);
          flag = false;
        });
      }

      //Update auth and firestore data of user 
      if(flag === true){
        delete values.userAvatar;
        await this.authService.doUpdateUser(values)
        .then(result => {
          if(result === 'success'){
            values.uid = this.user.uid;
            this.firebaseService.updateUser(values)
            .then(success => {
              this.successMessage = success;
              this.errorMessage = null;
            })
            .catch(error => {
              console.log(error);
              this.successMessage = null;
              this.errorMessage = error;
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.successMessage = null;
          this.errorMessage = "Something went wrong while trying to update";
        });
      }
      this.spinner.hide();
    }
  }

  //Custom functions
  async validation(values){
    let flag = true;
    let displayNameAvailable;

    if(values.displayName == null || values.displayName.trim() === ''){
      this.errorMessage = "DisplayName is required.";
      flag = false;
    }

    if(values.displayName !== this.user.displayName){
      await this.checkIfDisplayNameAvailable(values.displayName).then(result => {
        displayNameAvailable = result;
    });

      if(displayNameAvailable === false){
        flag = false;
      }
    }

    return flag;
  }

  async checkIfDisplayNameAvailable(displayName: string) {
    let flag = true;
    let users;

    await this.firebaseService.getUsers().then(result => {
      users = result;
    });

    await users.forEach(user => {
      if(displayName == user.payload.doc.data().displayName){
        this.errorMessage = "DisplayName taken";
        flag = false;
      }
    });

    return await flag;
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

  preview(userAvatar){
    if (userAvatar.length === 0)
    return;

    var mimeType = userAvatar[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    let reader = new FileReader();
    this.imagePath = userAvatar;
    reader.readAsDataURL(userAvatar[0]);
    reader.onload = (_event) => {
      this.imageURL = reader.result;
    }
  }
}



