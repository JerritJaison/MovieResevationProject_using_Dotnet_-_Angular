import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bookingdisplay } from './bookingdisplay';

describe('Bookingdisplay', () => {
  let component: Bookingdisplay;
  let fixture: ComponentFixture<Bookingdisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bookingdisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bookingdisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
