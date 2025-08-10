import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminArea } from './admin-area';

describe('AdminArea', () => {
  let component: AdminArea;
  let fixture: ComponentFixture<AdminArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
