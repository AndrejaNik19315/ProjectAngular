import { Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormsModule, Validators, Validator, ValidatorFn, AbstractControl } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../core/services/auth.service';
import { FirebaseService } from '../core/services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  users: Array<any>;

  constructor(private titleService: Title, private authService: AuthService, private firebaseService: FirebaseService, private router: Router) {
    this.titleService.setTitle('Divinity - Register');
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      'username': new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      'email': new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      'password': new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
      'repassword': new FormControl(null, [
        Validators.required
      ])
    });
  }

  async validation(values){
    let displayNameAvailable;

    if(values.username == null || values.username.trim() == ''){
      this.errorMessage = "Username is required.";
      return false;
    }
    if(values.email == null || values.email.trim() == ''){
      this.errorMessage = "Email is required";
      return false;
    }
    if(values.password == null || values.password.trim() == ''){
      this.errorMessage = "Password is required";
      return false;
    }
    if(values.password.length < 6){
      this.errorMessage = "Password needs to be at least 6 charactes long.";
      return false;
    }
    if(values.repassword != values.password){
      this.errorMessage = "Passwords do not match."
      return false;
    }

    await this.checkIfDisplayNameAvailable(values.username).then(result => {
      displayNameAvailable = result;
    });

    if(displayNameAvailable == false){
      return false;
    }

    return true;
  }

  async checkIfDisplayNameAvailable(displayName: string) {
    let users;
    let flag = true;

    await this.firebaseService.getUsers().then(result => {
      users = result;
    });

    await users.forEach(user => {
      if(displayName == user.payload.doc.data().displayName){
        this.errorMessage = "Username taken";
        flag = false;
      }
    });

    return flag;
  }

  async tryRegister(values){
    let flag;

    await this.validation(values).then(result => {
      flag = result;
    });

    if(flag === true){
      await this.authService.doRegister(values)
      .then(
        res => {
          try{
            let user : any = JSON.parse(localStorage.getItem('user'));
            user.displayName = values.username;
            this.firebaseService.insertUser(user);

            this.router.navigate(['/']);
          }
          catch(ex){
            this.errorMessage = ex.message;
          }
        }, 
        err => {
        this.errorMessage = err.message;
        this.successMessage = "";
      });
    }
  }

}
