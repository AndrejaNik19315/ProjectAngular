import { Category } from '../../shared/models/category.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [
    new Category('Gameplay', 'images/thumbnails/thumbnail_gameplay.jpg', 'gameplay_image', 'category/gameplay'),
    new Category('World', 'images/thumbnails/thumbnail_world.jpg', 'world_image', 'category/world'),
    new Category('Characters', 'images/thumbnails/thumbnail_characters.jpg', 'characters_image', 'category/characters'),
    new Category('Lore', 'images/thumbnails/thumbnail_lore.jpg', 'lore_image', 'category/lore'),
    new Category('Builds', 'images/thumbnails/thumbnail_builds.jpg', 'builds_image', 'category/builds'),
    new Category('Random', 'images/thumbnails/thumbnail_random.jpg', 'random_image', 'category/random')
  ];

  constructor() { }

  ngOnInit() {
  }

}
