import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirebaseService } from './../../core/services/firebase.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-categorypage',
  templateUrl: './categorypage.component.html',
  styleUrls: ['./categorypage.component.css']
})

export class CategorypageComponent implements OnInit, OnDestroy  {
  categories: Array<any>;
  categoryId: any;
  categoryPath: string;
  paramsSubscription: Subscription;
  categoryName: any;
  postData = Array<any>();

  constructor(private route: ActivatedRoute, private titleService: Title, private firebaseService: FirebaseService, public authService: AuthService, private spinner: NgxSpinnerService) {
    this.titleService.setTitle('Divinity - ' + route.snapshot.params['name'].charAt(0).toUpperCase() + route.snapshot.params['name'].slice(1));
  }

  ngOnInit(){
    //Simulates new data fetch each time url changes using rjxs
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

  recievePost($event){
    this.postData.unshift($event);
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
      this.categoryId = result[0].payload.doc.id;
    }).then(() => {
      this.firebaseService.getCategoryPosts(this.categoryId)
       .then(result => {
          this.postData = [];
          for(let i = 0; i < result.length; i++) {
            this.postData.push(result[i].payload.doc.data());
            this.postData[i].pid = result[i].payload.doc.id;
            this.firebaseService.getUser(this.postData[i].uid)
            .then(result => {
              this.postData[i].displayName = result[0].payload.doc.data().displayName;
              this.postData[i].userPhotoURL = result[0].payload.doc.data().photoURL;
            });
          }
        })
       .catch(error => console.log(error));
    });
  }

  async tryRemovePost(post){
    this.spinner.show();
    let flag = true;

    if(post.postPhotoURL !== null) {
      await this.firebaseService.removeImage(post.postPhotoURL)
      .catch(error => {
        flag = false;
        console.log(error);
      });
    }

    if(flag === true){
    let postIndex = this.postData.findIndex(postIndx => postIndx.pid === post.pid);
    let elements = document.getElementsByClassName('posts')[0];
    let element = elements.getElementsByClassName('post')[postIndex];
    if(post.uid === this.authService.user.uid && postIndex != null) {
      this.firebaseService.deleteCategoryPost(this.categoryId, post.pid)
      .then(() => {
        elements.removeChild(element);
        this.postData.splice(postIndex, 1);
      })
      .catch(error => console.log(error));
      }
    }

    this.spinner.hide();
  }
  
}
