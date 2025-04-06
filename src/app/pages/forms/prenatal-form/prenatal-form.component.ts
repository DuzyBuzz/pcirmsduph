import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prenatal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prenatal-form.component.html',
})
export class PrenatalFormComponent implements OnInit {
  motherForm!: FormGroup;
  emergencyForm!: FormGroup;
  showEmergency = false;
  showMotherConfirmModal = false;
  showFinalConfirmModal = false;

  auth = inject(Auth);
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  mothers: any[] = [];

  emergencyFields = [
    { name: 'spouseName', label: 'Spouse Name', type: 'text' },
    { name: 'spouseContact', label: 'Spouse Contact Number', type: 'tel' },
    { name: 'parentName', label: 'Parent/Guardian Name', type: 'text' },
    { name: 'parentContact', label: 'Parent/Guardian Contact', type: 'tel' },
    { name: 'fatherName', label: 'Father’s Name', type: 'text' },
    { name: 'fatherContact', label: 'Father’s Contact Number', type: 'tel' },
  ];

  constructor(private fb: FormBuilder, private firestore: Firestore, private router: Router) {}

  ngOnInit(): void {
    this.motherForm = this.fb.group({
      name: ['', Validators.required],
      homeAddress: ['', Validators.required],
      contactNumber: ['', Validators.required],
      age: ['', Validators.required],
      g: [''],
      p: [''],
      hx: [''],
      lmp: [''],
      dueDate: ['', Validators.required],
      ultrasound: ['']
    });

    this.emergencyForm = this.fb.group({
      spouseName: [''],
      spouseContact: [''],
      parentName: [''],
      parentContact: [''],
      fatherName: [''],
      fatherContact: ['']
    });

    this.loadMothers();
  }

  isInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  openMotherConfirmationModal(): void {
    if (this.motherForm.invalid) {
      this.motherForm.markAllAsTouched();
      return;
    }
    this.showMotherConfirmModal = true;
  }

  confirmMotherInfo(): void {
    this.showMotherConfirmModal = false;
    this.showEmergency = true;
  }

  cancelMotherConfirmation(): void {
    this.showMotherConfirmModal = false;
  }

  backToMotherForm(): void {
    this.showEmergency = false;
  }

  openFinalConfirmationModal(): void {
    if (!this.atLeastOneEmergency()) {
      this.notificationMessage = 'Please provide at least one emergency contact.';
      this.notificationType = 'error';
      return;
    }
    this.showFinalConfirmModal = true;
  }

  cancelFinalConfirmation(): void {
    this.showFinalConfirmModal = false;
  }

  async confirmFinalInfo(): Promise<void> {
    this.showFinalConfirmModal = false;
    const motherInfo = this.motherForm.value;
    const emergencyInfo = this.emergencyForm.value;
    const data = { ...motherInfo, ...emergencyInfo };

    try {
      const ref = collection(this.firestore, 'mothers');
      await addDoc(ref, data);

      this.notificationMessage = 'Mother and emergency info saved successfully!';
      this.notificationType = 'success';

      this.motherForm.reset();
      this.emergencyForm.reset();
      this.showEmergency = false;

      this.loadMothers();
    } catch (error) {
      console.error(error);
      this.notificationMessage = 'Failed to save data. Please try again.';
      this.notificationType = 'error';
    }

    setTimeout(() => {
      this.notificationMessage = '';
      this.router.navigate(['/ob-gyne/prenatal']);
    }, 4000);
  }

  atLeastOneEmergency(): boolean {
    const { spouseContact, parentContact, fatherContact } = this.emergencyForm.value;
    return !!(spouseContact || parentContact || fatherContact);
  }

  loadMothers(): void {
    const ref = collection(this.firestore, 'mothers');
    collectionData(ref, { idField: 'id' }).subscribe(data => {
      this.mothers = data;
    });
  }
}
