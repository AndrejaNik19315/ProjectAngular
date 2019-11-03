import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate } from '@angular/router/src/utils/preactivation';

@Injectable({
  providedIn: 'root'
})
export class LoggedinGuardService implements CanActivate {
  path: import("@angular/router").ActivatedRouteSnapshot[];
  route: import("@angular/router").ActivatedRouteSnapshot;

  constructor(private location: Location) { }

  canActivate(): boolean{
    const user = JSON.parse(localStorage.getItem('user'));
    if(user !== null)
    {
      this.location.back();
      return false;
    }
    return true;
  }

}
