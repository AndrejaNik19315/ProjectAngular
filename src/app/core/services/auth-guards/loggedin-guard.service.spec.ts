import { TestBed } from '@angular/core/testing';

import { LoggedinGuardService } from './loggedin-guard.service';

describe('LoggedinGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoggedinGuardService = TestBed.get(LoggedinGuardService);
    expect(service).toBeTruthy();
  });
});
