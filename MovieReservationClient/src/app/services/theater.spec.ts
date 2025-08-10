import { TestBed } from '@angular/core/testing';

import { Theater } from './theater';

describe('Theater', () => {
  let service: Theater;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Theater);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
