import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;

  constructor(private titleService: Title, private authService: AuthService) {
    this.titleService.setTitle('Divinity - Login');
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null),
      'password': new FormControl(null)
    });
  }

  tryLogin(value){
    let flag = true;
    
    if(value.email == null || value.email.trim() == "")
      flag = false;
    if(value.password == null || value.password.trim() == "")
      flag = false;
    
    if(flag == true){
      this.authService.doLogin(value);
    }
    else{
      this.errorMessage = "Email or password are empty";
    }
  }

}
