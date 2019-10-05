import { FormGroup, Validators, FormControl, ControlValueAccessor } from '@angular/forms';
import { Component, OnInit, ElementRef, HostListener, Directive } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  updateUserForm: FormGroup;
  user: any = JSON.parse(localStorage.getItem('user'));
  dateJoined: Date = new Date(parseInt(this.user.createdAt));

  private file: File | null = null;

  errorMessage: string;
  successMessage: string;

  @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
    const file = event && event.item(0);
    this.file = file;
  }

  constructor(private titleService: Title, private authService: AuthService, private firebaseService: FirebaseService) {
    this.titleService.setTitle('Divinity - User Update');
  }

  ngOnInit() {
    this.updateUserForm = new FormGroup({
      'displayName': new FormControl(this.user.displayName, [
        Validators.required,
        Validators.minLength(3)
      ]),
      'userImage' : new FormControl(null, [
        this.allowedFileType(['png','jpeg','jpg'])
      ])
    });
  }

  async tryUpdateUser(values){
    values.userImage = this.file;
    let flag;

    await this.validation(values).then(result => {
      flag = result;
    });

    if(flag === true){
      //let flag = true;

      if(values.userImage !== null){
        await this.firebaseService.uploadImage(values.userImage).then(result => {
          if(result.state === 'success'){
            values.photoURL = result.metadata.fullPath;
          }
        }).catch(function(error){
          flag = false;
          this.errorMessage = "Something went wrong while uploading image.";
        });
      }

      if(flag === true){
        await this.authService.doUpdateUser(values)
        .then(result => {
          if(result === 'success'){
            values.uid = this.user.uid;
            this.firebaseService.updateUser(values);
          }
        })
        .catch(function(error){
          console.log(error);
        });
        // await this.firebaseService.updateUser(values).then(result => {
        //   console.log(result);
        // });
      }
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
    let users;
    let flag = true;

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

}



