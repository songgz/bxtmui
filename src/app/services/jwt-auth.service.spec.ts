import { TestBed } from '@angular/core/testing';

import { JwtAuthService } from './jwt-auth.service';

describe('JwtAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JwtAuthService = TestBed.get(JwtAuthService);
    expect(service).toBeTruthy();
  });
});
