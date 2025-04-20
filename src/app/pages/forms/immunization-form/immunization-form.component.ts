import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { SpinnnerComponent } from '../../../shared/core/spinnner/spinnner.component';
import { BusinessAddressMapComponent } from '../../../shared/core/business-address-map/business-address-map.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-immunization-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpinnnerComponent,
    BusinessAddressMapComponent
  ],
  templateUrl: './immunization-form.component.html',
  styleUrls: ['./immunization-form.component.scss'] // ✅ fixed typo here
})
export class ImmunizationFormComponent {
  immunizationForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private router: Router
  ) {
    // ✅ Initialize the form group with validations
    this.immunizationForm = this.fb.group({
      childName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      address: ['', Validators.required],
      birthWeight: [null, [Validators.required, Validators.min(0.5)]],
      birthLength: [null, [Validators.required, Validators.min(10)]],
      birthHeadCircumference: [null, [Validators.required, Validators.min(10)]],
      motherName: ['', Validators.required],
      fatherName: ['', Validators.required],
      motherContact: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      fatherContact: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
    });
  }

  // ✅ Check if a field is invalid and touched
  isInvalid(controlName: string): boolean {
    const control = this.immunizationForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // ✅ Return error messages for fields
  getErrorMessage(controlName: string): string {
    const control = this.immunizationForm.get(controlName);
    if (control?.hasError('required')) return 'This field is required.';
    if (control?.hasError('min')) return 'Value is too low.';
    if (control?.hasError('pattern')) return 'Invalid format.';
    return '';
  }

  // ✅ Form submission handler
  async submitForm() {
    if (this.immunizationForm.valid) {
      this.isSubmitting = true;
      const formData = this.immunizationForm.value;

      try {
        const childrenCollection = collection(this.firestore, 'children');
        await addDoc(childrenCollection, {
          ...formData,
          createdAt: new Date()
        });

        alert('✅ Immunization record saved successfully!');
        this.immunizationForm.reset();
      } catch (error) {
        console.error('❌ Firestore error:', error);
        alert('❌ Failed to save record. Please try again.');
      } finally {
        this.isSubmitting = false;
        this.router.navigate(['/HCP/immunization'])
      }
    } else {
      this.immunizationForm.markAllAsTouched(); // Trigger validation
    }
  }
}
