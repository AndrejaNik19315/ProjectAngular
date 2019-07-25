import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HomepageComponent } from './homepage/homepage.component';
import { NavigationComponent } from './homepage/navigation/navigation.component';
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

export const firebaseConfig = {
  firebase: {
    apiKey: 'AIzaSyABNC1_k-JcpQmbl-ot81njhuMqAmMSLYo',
    authDomain: 'divinityproject-31d93.firebaseapp.com',
    databaseURL: 'https://divinityproject-31d93.firebaseio.com',
    projectId: 'divinityproject-31d93',
    storageBucket: '',
    messagingSenderId: '1080292503258',
    appId: '1:1080292503258:web:e9469267948b9354'
  }
}

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
    CategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    ScrollToModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
