import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FirebaseService } from 'src/app/core/services/firebase.service';

@Component({
  selector: 'app-display-post',
  templateUrl: './display-post.component.html',
  styleUrls: ['./display-post.component.css']
})
export class DisplayPostComponent implements OnInit {

  post: any;
  comments: Array<any>;

  constructor(private route: ActivatedRoute, private titleService: Title, private firebaseService: FirebaseService) {
    this.titleService.setTitle('Divinity - Post');
  }


  ngOnInit() {
  }

}
