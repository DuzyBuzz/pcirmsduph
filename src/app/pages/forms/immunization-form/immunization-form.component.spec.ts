import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmunizationFormComponent } from './immunization-form.component';

describe('ImmunizationFormComponent', () => {
  let component: ImmunizationFormComponent;
  let fixture: ComponentFixture<ImmunizationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmunizationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmunizationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
