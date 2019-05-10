import { TestBed, inject } from '@angular/core/testing';
import { ImportService } from '../services/import.service';

describe('ImportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImportService]
    });
  });

  it('should be created', inject([ImportService], (service: ImportService) => {
    expect(service).toBeTruthy();
  }));
});
