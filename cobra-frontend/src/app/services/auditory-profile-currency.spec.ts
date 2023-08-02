import { TestBed } from '@angular/core/testing';
import { AuditoryCurrencyProfile } from './auditory-profile-currency';


describe('AutomaticDebitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditoryCurrencyProfile = TestBed.get(AuditoryCurrencyProfile);
    expect(service).toBeTruthy();
  });
});
