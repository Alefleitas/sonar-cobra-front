import { TestBed } from '@angular/core/testing';

import { DateQuotesService } from './date-quotes.service';

describe('DateQuotesService', () => {
  let service: DateQuotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateQuotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
