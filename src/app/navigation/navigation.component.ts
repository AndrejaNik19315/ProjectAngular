import { Component, OnInit, HostListener } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from '../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  user: any = JSON.parse(localStorage.getItem('user'));

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    $(document).ready(function(){
      const element = document.getElementById('mainNav');
      if (window.pageYOffset > 550) {
        $(element).addClass('navbar-scrolled');
      } else{
        $(element).removeClass('navbar-scrolled');
      }
    });
  }

}
