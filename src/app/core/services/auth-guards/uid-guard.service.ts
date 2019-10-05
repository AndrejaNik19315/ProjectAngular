import { CanActivate } from '@angular/router/src/utils/preactivation';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UidGuardService implements CanActivate {
  path: import("@angular/router").ActivatedRouteSnapshot[];
  route: import("@angular/router").ActivatedRouteSnapshot;

  constructor(private auth: AuthService, private router: Router, private location: Location) { }

  canActivate(route: ActivatedRouteSnapshot): boolean{
    const uidTarget = route.paramMap.get('uid');
    const uidUser = JSON.parse(localStorage.getItem('user')).uid;
    if(uidUser !== uidTarget){
      this.location.back();
      return false;
    }
    return true;
  }
}
