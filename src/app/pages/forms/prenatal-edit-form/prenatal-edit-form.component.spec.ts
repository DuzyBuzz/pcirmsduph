import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenatalEditFormComponent } from './prenatal-edit-form.component';

describe('PrenatalEditFormComponent', () => {
  let component: PrenatalEditFormComponent;
  let fixture: ComponentFixture<PrenatalEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrenatalEditFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrenatalEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
