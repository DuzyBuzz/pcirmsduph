import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterChildrenComponent } from './register-children.component';

describe('RegisterChildrenComponent', () => {
  let component: RegisterChildrenComponent;
  let fixture: ComponentFixture<RegisterChildrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterChildrenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
