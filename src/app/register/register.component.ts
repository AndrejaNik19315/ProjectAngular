import { Params } from '@angular/router';
import { FormGroup, FormControl, FormsModule, Validators, Validator, ValidatorFn, AbstractControl } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../core/services/auth.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string;
  successMessage: string;

  constructor(private titleService: Title, private authService: AuthService) {
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

  validation(values){
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
    if(values.password.length < 5){
      this.errorMessage = "Password needs to be at least 6 charactes long.";
      return false;
    }
    if(values.repassword != values.password){
      this.errorMessage = "Passwords do not match."
      return false;
    }

    return true;
  }

  tryRegister(values){
    let flag = this.validation(values);
    if(flag === true){
      this.authService.doRegister(values)
      .then(res => {
        this.errorMessage = "";
        this.successMessage = "Account created.";
      }, err => {
        this.errorMessage = err.message;
        this.successMessage = "";
      });
    }
  }
}
