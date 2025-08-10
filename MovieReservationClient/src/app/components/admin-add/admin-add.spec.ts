import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdd } from './admin-add';

describe('AdminAdd', () => {
  let component: AdminAdd;
  let fixture: ComponentFixture<AdminAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
