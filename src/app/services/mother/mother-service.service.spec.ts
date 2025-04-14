import { TestBed } from '@angular/core/testing';
import { MothersService } from './mother-service.service';


describe('MotherServiceService', () => {
  let service: MothersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MothersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
