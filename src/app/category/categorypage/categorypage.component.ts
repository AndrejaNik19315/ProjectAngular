import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { database } from 'firebase';

@Component({
  selector: 'app-categorypage',
  templateUrl: './categorypage.component.html',
  styleUrls: ['./categorypage.component.css']
})
export class CategorypageComponent implements OnInit {
  public data;

  constructor(private router: Router, private route: ActivatedRoute, private titleService: Title) { 
    this.titleService.setTitle('Divinity - '+route.snapshot.params['name'].charAt(0).toUpperCase()+route.snapshot.params['name'].slice(1));
  }

  ngOnInit() {
    this.data = {
      title_name: this.route.snapshot.params['name'].charAt(0).toUpperCase()+this.route.snapshot.params['name'].slice(1)
    };
  }

}
