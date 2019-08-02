import { CategoryComponent } from './category/category.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'category/:name', component: CategoryComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'user', component: UserComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
