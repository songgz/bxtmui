import { TestBed } from '@angular/core/testing';

import { ExcelReaderService } from './excel-reader.service';

describe('ExcelReaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExcelReaderService = TestBed.get(ExcelReaderService);
    expect(service).toBeTruthy();
  });
});
