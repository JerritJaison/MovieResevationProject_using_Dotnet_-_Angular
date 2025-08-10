import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieAdd } from './movie-add';

describe('MovieAdd', () => {
  let component: MovieAdd;
  let fixture: ComponentFixture<MovieAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
