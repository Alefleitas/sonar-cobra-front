import { TestBed } from '@angular/core/testing';

import { ContactDetailService } from './contact-detail.service';

describe('ContactDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContactDetailService = TestBed.get(ContactDetailService);
    expect(service).toBeTruthy();
  });
});
