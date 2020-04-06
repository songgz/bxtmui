import { TestBed } from '@angular/core/testing';

import { Ng2ActionCableService } from './ng2-action-cable.service';

describe('Ng2ActionCableService', () => {
  let service: Ng2ActionCableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ng2ActionCableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
