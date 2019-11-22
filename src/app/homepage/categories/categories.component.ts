import { FirebaseService } from './../../core/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Array<any>;

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getCategories().then(result => {
      this.categories = result;
    });
  }
}
