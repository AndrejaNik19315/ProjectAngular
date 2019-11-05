import { Component, OnInit, Host, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirebaseService } from './../../core/services/firebase.service';

@Component({
  selector: 'app-categorypage',
  templateUrl: './categorypage.component.html',
  styleUrls: ['./categorypage.component.css']
})
export class CategorypageComponent implements OnInit, OnDestroy {
  public data;
  categories: Array<any>;
  category: any;
  categoryPath: string;
  posts: Array<any>;
  paramsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private titleService: Title, private firebaseService: FirebaseService) {
    this.titleService.setTitle('Divinity - ' + route.snapshot.params['name'].charAt(0).toUpperCase() + route.snapshot.params['name'].slice(1));
  }

  ngOnInit(){

    this.data = {
      title_name: this.route.snapshot.params['name'].charAt(0).toUpperCase() + this.route.snapshot.params['name'].slice(1)
    };
    //Simulates new data fetch each time url changes
    this.paramsSubscription = this.route.params.subscribe(
      params => {
        this.categoryPath = 'category/'+this.route.snapshot.params.name;
        this.data.title_name = params['name'].charAt(0).toUpperCase() + params['name'].slice(1);
        this.titleService.setTitle('Divinity - ' + this.data.title_name);
        this.getCategoryData(this.categoryPath);
      }
    );

    this.getCategories();
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  getCategories(){
    this.firebaseService.getCategories().then(result => {
      this.categories = result;
    });
  }

  getCategoryData(categoryPath){
    this.firebaseService.getCategory(categoryPath).then(result => {
      this.category = result[0].payload.doc;
    }).then(() => {
      this.firebaseService.getCategoryPosts(this.category.id)
       .then(result => this.posts = result)
       .catch(error => this.posts = error);
    });
  }
}
