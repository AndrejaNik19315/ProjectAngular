import { PopupModal } from './../../shared/interfaces/popup-modal';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirebaseService } from './../../core/services/firebase.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-categorypage',
  templateUrl: './categorypage.component.html',
  styleUrls: ['./categorypage.component.css']
})

export class CategorypageComponent implements OnInit, OnDestroy, PopupModal {
  modalRef: BsModalRef;
  template: TemplateRef<any>;

  popupTitle: string = "Delete Post";
  popupDescription: string = "This action cannot be reverted, are you sure you wish to proceed?";

  post: any;

  categories: Array<any>;
  categoryId: any;
  categoryPath: string;
  paramsSubscription: Subscription;
  categoryName: any;
  postData = Array<any>();

  constructor(private route: ActivatedRoute, private titleService: Title, private firebaseService: FirebaseService, public authService: AuthService, private spinner: NgxSpinnerService, private modalService: BsModalService) {
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

  openModal(template: TemplateRef<any>, post) {
    this.modalRef = this.modalService.show(template);
    this.post = post;
  }

  async tryRemovePost() {
    this.modalRef.hide();
    console.log(this.post);
    this.spinner.show();
    let flag = true;

    if(this.post.postPhotoURL !== null) {
      await this.firebaseService.removeImage(this.post.postPhotoURL)
      .catch(error => {
        flag = false;
        console.log(error);
      });
    }

    if(flag === true){
    let postIndex = this.postData.findIndex(postIndx => postIndx.pid === this.post.pid);
    let elements = document.getElementsByClassName('posts')[0];
    let element = elements.getElementsByClassName('post')[postIndex];
    if(this.post.uid === this.authService.user.uid && postIndex != null) {
      this.firebaseService.deleteCategoryPost(this.categoryId, this.post.pid)
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
