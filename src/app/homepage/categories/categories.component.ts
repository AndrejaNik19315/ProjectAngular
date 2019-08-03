import { FirebaseService } from './../../core/services/firebase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  items: Array<any>;

  constructor(public firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getCategories().then(result => {
      this.items = result;
    });
  }

}
