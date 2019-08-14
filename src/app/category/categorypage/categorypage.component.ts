import { Component, OnInit, Host, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from 'src/app/shared/models/category.model';
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
  paramsSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private titleService: Title, private firebaseService: FirebaseService) {
    this.titleService.setTitle('Divinity - ' + route.snapshot.params['name'].charAt(0).toUpperCase() + route.snapshot.params['name'].slice(1));
  }

  ngOnInit(): void {
    this.data = {
      title_name: this.route.snapshot.params['name'].charAt(0).toUpperCase() + this.route.snapshot.params['name'].slice(1)
    };

    this.paramsSubscription = this.route.params.subscribe(
      params => {
        this.data.title_name = params['name'].charAt(0).toUpperCase() + params['name'].slice(1),
        this.titleService.setTitle('Divinity - ' + this.data.title_name)
      }
    );

    this.firebaseService.getCategories().then(result => {
      this.categories = result;
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

}
