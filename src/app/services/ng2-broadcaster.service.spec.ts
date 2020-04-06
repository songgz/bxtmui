import { TestBed } from '@angular/core/testing';

import { Ng2BroadcasterService } from './ng2-broadcaster.service';

describe('Ng2BroadcasterService', () => {
  let service: Ng2BroadcasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ng2BroadcasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
