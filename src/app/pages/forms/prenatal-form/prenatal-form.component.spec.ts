import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrenatalFormComponent } from './prenatal-form.component';

describe('PrenatalFormComponent', () => {
  let component: PrenatalFormComponent;
  let fixture: ComponentFixture<PrenatalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrenatalFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrenatalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
