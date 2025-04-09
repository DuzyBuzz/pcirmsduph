import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prenatal-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './prenatal-edit-form.component.html',
  styleUrls: ['./prenatal-edit-form.component.scss'],
})
export class PrenatalEditFormComponent implements OnInit {
  @Input() motherId: string | null = null;

  motherForm!: FormGroup;
  emergencyForm!: FormGroup;

  showEmergency = false;
  showMotherConfirmModal = false;
  showFinalConfirmModal = false;
  showConfirmation = false;

  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  existingData: any = {};
  changedFields: Array<{ label: string; oldValue: string; newValue: string }> = [];

  emergencyFields = [
    { name: 'spouseName', label: 'Spouse Name' },
    { name: 'spouseContact', label: 'Spouse Contact' },
    { name: 'motherName', label: 'Mother Name' },
    { name: 'motherContact', label: 'Mother Contact' },
    { name: 'fatherName', label: 'Father Name' },
    { name: 'fatherContact', label: 'Father Contact' },
  ];

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    if (this.motherId) {
      this.initializeForms();
      this.loadData();
    }
  }

  initializeForms(): void {
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
      ultrasound: [''],
    });

    this.emergencyForm = this.fb.group({
      spouseName: [''],
      spouseContact: [''],
      motherName: [''],
      motherContact: [''],
      fatherName: [''],
      fatherContact: [''],
    });
  }

  async loadData(): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'mothers', this.motherId!);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        this.existingData = snapshot.data();
        this.motherForm.patchValue(this.existingData);
        this.emergencyForm.patchValue(this.existingData);
      } else {
        this.showNotification('No such document found.', 'error');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.showNotification('Error fetching document.', 'error');
    }
  }

  getChangedFields(form: FormGroup, existingData: any): any {
    const changes: any = {};
    Object.keys(form.value).forEach((key) => {
      if (form.value[key] !== existingData[key]) {
        changes[key] = {
          oldValue: existingData[key] || '',
          newValue: form.value[key],
        };
      }
    });
    return changes;
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

  cancelFinalConfirmation(): void {
    this.showFinalConfirmModal = false;
  }

  backToMotherForm(): void {
    this.showEmergency = false;
  }

  proceedToEmergency(): void {
    if (this.motherForm.invalid) {
      this.motherForm.markAllAsTouched();
      return;
    }
    this.showEmergency = true;
  }

  atLeastOneEmergency(): boolean {
    const { spouseContact, motherContact, fatherContact } = this.emergencyForm.value;
    return !!(spouseContact || motherContact || fatherContact);
  }
  openFinalConfirmationModal(): void {
    if (!this.atLeastOneEmergency()) {
      this.notificationMessage = 'Please provide at least one emergency contact.';
      this.notificationType = 'error';
      return;
    }

    const motherChanges = this.getChangedFields(this.motherForm, this.existingData);
    const emergencyChanges = this.getChangedFields(this.emergencyForm, this.existingData);

    this.changedFields = [
      ...Object.entries(motherChanges).map(([key, val]) => {
        const typedVal = val as { oldValue: any; newValue: any };
        return {
          label: this.formatLabel(key),
          oldValue: typedVal.oldValue,
          newValue: typedVal.newValue
        };
      }),
      ...Object.entries(emergencyChanges).map(([key, val]) => {
        const typedVal = val as { oldValue: any; newValue: any };
        return {
          label: this.formatLabel(key),
          oldValue: typedVal.oldValue,
          newValue: typedVal.newValue
        };
      })
    ];

    if (this.changedFields.length === 0) {
      this.notificationMessage = 'No changes detected.';
      this.notificationType = 'error';
      return;
    }

    this.showConfirmation = true;
  }

  formatLabel(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  onCancel(): void {
    this.showConfirmation = false;
  }

  confirmSave(): void {
    this.submitEdits();
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;

    setTimeout(() => {
      this.notificationMessage = '';
    }, 4000);
  }

  async submitEdits(): Promise<void> {
    this.showFinalConfirmModal = false;
    this.showConfirmation = false;

    const user = this.auth.currentUser;
    if (!user) {
      this.showNotification('User not authenticated. Please log in again.', 'error');
      return;
    }

    const userRef = doc(this.firestore, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      this.showNotification('User data not found.', 'error');
      return;
    }

    const userData = userSnap.data();
    const { name, hospitalAddress, hospitalName } = userData;

    const updatedData = {
      ...this.motherForm.value,
      ...this.emergencyForm.value,
      uid: user.uid,
      attendantName: name || '',
      hospitalAddress: hospitalAddress || '',
      hospitalName: hospitalName || '',
      updatedAt: new Date(),
    };

    try {
      const docRef = doc(this.firestore, 'mothers', this.motherId!);
      await updateDoc(docRef, updatedData);

      this.showNotification('Mother and emergency info updated successfully!', 'success');

      this.motherForm.reset();
      this.emergencyForm.reset();
      this.router.navigate(['/ob-gyne/prenatal']);
    } catch (error) {
      console.error(error);
      this.showNotification('Failed to update data. Please try again.', 'error');
    }
  }
}
