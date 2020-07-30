import { TestBed } from '@angular/core/testing';

import { ReviewsortService } from './reviewsort.service';

describe('ReviewsortService', () => {
  let service: ReviewsortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewsortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
