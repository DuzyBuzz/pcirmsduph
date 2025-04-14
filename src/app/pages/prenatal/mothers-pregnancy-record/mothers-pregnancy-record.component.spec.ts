import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MothersPregnancyRecordComponent } from './mothers-pregnancy-record.component';

describe('MothersPregnancyRecordComponent', () => {
  let component: MothersPregnancyRecordComponent;
  let fixture: ComponentFixture<MothersPregnancyRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MothersPregnancyRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MothersPregnancyRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
