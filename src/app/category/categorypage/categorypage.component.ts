import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CreatePostComponent } from './post/create-post/create-post.component';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirebaseService } from './../../core/services/firebase.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-categorypage',
  templateUrl: './categorypage.component.html',
  styleUrls: ['./categorypage.component.css']
})
export class CategorypageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(CreatePostComponent) child;

  categories: Array<any>;
  category: any;
  categoryPath: string;
  posts: Array<any>;
  paramsSubscription: Subscription;
  categoryName: any;
  postData = [];

  ngAfterViewInit(): void {
    if(this.child.post != null){
      this.postData.unshift(this.child.post);
    }
  }

  constructor(private route: ActivatedRoute, private titleService: Title, private firebaseService: FirebaseService, public authService: AuthService) {
    this.titleService.setTitle('Divinity - ' + route.snapshot.params['name'].charAt(0).toUpperCase() + route.snapshot.params['name'].slice(1));
  }

  ngOnInit(){
    //Simulates new data fetch each time url changes
    this.paramsSubscription = this.route.params.subscribe(
      () => {
        this.categoryPath = 'category/' + this.route.snapshot.params.name;
        this.categoryName = this.route.snapshot.params['name'].charAt(0).toUpperCase() + this.route.snapshot.params['name'].slice(1);
        this.titleService.setTitle('Divinity - ' + this.categoryName);
        this.getCategoryData(this.categoryPath);
      }
    );

    this.getCategories();
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  getCategories() {
    this.firebaseService.getCategories().then(result => {
      this.categories = result;
    });
  }

  getCategoryData(categoryPath) {
    this.firebaseService.getCategory(categoryPath).then(result => {
      this.category = result[0].payload.doc;
    }).then(() => {
      this.firebaseService.getCategoryPosts(this.category.id)
       .then(result => {
         this.postData  = [];
         if(result.length > 0){
            for(let i = 0; i < result.length; i++) {
              this.postData.push(result[i].payload.doc.data());
              this.postData[i].pid = result[i].payload.doc.id;
              this.firebaseService.getUser(this.postData[i].uid)
              .then(result => {
                this.postData[i].displayName = result[0].payload.doc.data().displayName;
                this.postData[i].userPhotoURL = result[0].payload.doc.data().photoURL;
              });
            }
          }
        })
       .catch(error => console.log(error));
    });
  }
}
