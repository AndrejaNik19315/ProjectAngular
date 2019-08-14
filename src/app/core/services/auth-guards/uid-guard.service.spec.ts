import { TestBed } from '@angular/core/testing';

import { UidGuardService } from './uid-guard.service';

describe('UidGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UidGuardService = TestBed.get(UidGuardService);
    expect(service).toBeTruthy();
  });
});
