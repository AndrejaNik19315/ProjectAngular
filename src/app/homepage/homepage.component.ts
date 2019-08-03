import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
import { AuthService } from '../core/services/auth.service';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {

  constructor(private titleService: Title) {
    this.titleService.setTitle('Divinity - Homepage');
  }

  ngOnInit() {
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    $(document).ready(function(){
      const element = document.getElementById('btn-scrollup');
      if (window.pageYOffset > 550) {
        $(element).fadeIn(500);
      } else{
        $(element).fadeOut(500);
      }
    });
  }

  toTop(e){
    e.stopPropagation();
    if($("html,body").scrollTop() > 0){
      $("html,body").animate({scrollTop: 0}, 1000);
    }
  }
}
