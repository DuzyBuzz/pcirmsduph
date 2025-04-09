import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenatalEditRecordComponent } from './prenatal-edit-record.component';

describe('PrenatalEditRecordComponent', () => {
  let component: PrenatalEditRecordComponent;
  let fixture: ComponentFixture<PrenatalEditRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrenatalEditRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrenatalEditRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
