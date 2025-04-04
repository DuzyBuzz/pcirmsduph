import { TestBed } from '@angular/core/testing';

import { MotherServiceService } from './mother-service.service';

describe('MotherServiceService', () => {
  let service: MotherServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotherServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
