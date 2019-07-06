import { TestBed } from '@angular/core/testing';

import { ExcelFileService } from './excel-file.service';

describe('ExcelFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExcelFileService = TestBed.get(ExcelFileService);
    expect(service).toBeTruthy();
  });
});
