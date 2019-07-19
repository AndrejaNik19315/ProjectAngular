import { Component, OnInit, HostListener } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

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
