import { TestBed } from '@angular/core/testing';

import { AutomaticDebitService } from './automatic-debit.service';

describe('AutomaticDebitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutomaticDebitService = TestBed.get(AutomaticDebitService);
    expect(service).toBeTruthy();
  });
});
