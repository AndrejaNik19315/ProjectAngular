import { AuthService } from './core/services/auth.service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HomepageComponent } from './homepage/homepage.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MastheadComponent } from './homepage/masthead/masthead.component';
import { DescriptionComponent } from './homepage/description/description.component';
import { CategoriesComponent } from './homepage/categories/categories.component';
import { ContactComponent } from './homepage/contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { environment } from 'src/environments/environment.prod';
import { CategorypageComponent } from './category/categorypage/categorypage.component';
import { CategoryComponent } from './category/category.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { BackBtnComponent } from './shared/components/back-btn/back-btn.component';
import { PostComponent } from './category/categorypage/post/post.component';
import { DisplayPostComponent } from './category/categorypage/post/display-post/display-post.component';
import { CreatePostComponent } from './category/categorypage/post/create-post/create-post.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    NavigationComponent,
    MastheadComponent,
    DescriptionComponent,
    CategoriesComponent,
    ContactComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    CategorypageComponent,
    CategoryComponent,
    NotFoundComponent,
    UserComponent,
    UserEditComponent,
    BackBtnComponent,
    PostComponent,
    DisplayPostComponent,
    CreatePostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    ScrollToModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    NgxSpinnerModule
  ],
  providers: [
    Title,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public afAuth: AngularFireAuth){}
}
