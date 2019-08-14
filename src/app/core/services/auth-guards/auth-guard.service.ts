import { AuthService } from '../auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  path: import("@angular/router").ActivatedRouteSnapshot[];
  route: import("@angular/router").ActivatedRouteSnapshot;

  constructor(private auth: AuthService, private router: Router, private location: Location) { }

  canActivate(): boolean{
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("In AuthGuard");
    if(user === null)
    {
      this.location.back();
      return false;
    }
    return true;
  }
}
