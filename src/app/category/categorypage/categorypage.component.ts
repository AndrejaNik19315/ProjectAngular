import { Component, OnInit, Host, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { database } from 'firebase';
import { Category } from 'src/app/shared/models/category.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categorypage',
  templateUrl: './categorypage.component.html',
  styleUrls: ['./categorypage.component.css']
})
export class CategorypageComponent implements OnInit, OnDestroy {
  public data;
  paramsSubscription: Subscription;
 
  public c: Category[] = [
    new Category('Gameplay', 'images/thumbnails/thumbnail_gameplay.jpg', 'gameplay_image', 'category/gameplay'),
    new Category('World', 'images/thumbnails/thumbnail_world.jpg', 'world_image', 'category/world'),
    new Category('Characters', 'images/thumbnails/thumbnail_characters.jpg', 'characters_image', 'category/characters'),
    new Category('Lore', 'images/thumbnails/thumbnail_lore.jpg', 'lore_image', 'category/lore'),
    new Category('Builds', 'images/thumbnails/thumbnail_builds.jpg', 'builds_image', 'category/builds'),
    new Category('Random', 'images/thumbnails/thumbnail_random.jpg', 'random_image', 'category/random')
  ];

  constructor(private router: Router, private route: ActivatedRoute, private titleService: Title) {
    this.titleService.setTitle('Divinity - ' + route.snapshot.params['name'].charAt(0).toUpperCase() + route.snapshot.params['name'].slice(1));
  }

  ngOnInit(): void {
    this.data = {
      title_name: this.route.snapshot.params['name'].charAt(0).toUpperCase() + this.route.snapshot.params['name'].slice(1),
      categories: this.c
    };

    this.paramsSubscription = this.route.params.subscribe(
      params => {
        this.data.title_name = params['name'].charAt(0).toUpperCase() + params['name'].slice(1),
        this.titleService.setTitle('Divinity - ' + this.data.title_name)
      }
    );
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

}
