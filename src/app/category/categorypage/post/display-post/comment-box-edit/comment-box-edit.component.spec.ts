import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentBoxEditComponent } from './comment-box-edit.component';

describe('CommentBoxEditComponent', () => {
  let component: CommentBoxEditComponent;
  let fixture: ComponentFixture<CommentBoxEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentBoxEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentBoxEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
