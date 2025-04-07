import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  existingData: any = {}; // Store fetched data here

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

  // Fetch data from Firestore based on the received motherId
  async loadData(): Promise<void> {
    if (this.motherId) {
      try {
        const docRef = doc(this.firestore, 'mothers', this.motherId);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          this.existingData = snapshot.data();
          this.motherForm.patchValue(this.existingData);
          this.emergencyForm.patchValue(this.existingData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    }
  }

  // Check and compare if there's a change in data
  getChangedFields(form: FormGroup, existingData: any): any {
    const changes: any = {};
    Object.keys(form.value).forEach((key) => {
      if (form.value[key] !== existingData[key]) {
        changes[key] = { oldValue: existingData[key], newValue: form.value[key] };
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

  async submitEdits(): Promise<void> {
    this.showFinalConfirmModal = false;

    const user = this.auth.currentUser;

    if (!user) {
      this.notificationMessage = 'User not authenticated. Please log in again.';
      this.notificationType = 'error';
      return;
    }

    const userRef = doc(this.firestore, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      this.notificationMessage = 'User data not found.';
      this.notificationType = 'error';
      return;
    }

    const motherInfo = this.motherForm.value;
    const emergencyInfo = this.emergencyForm.value;

    const userData = userSnap.data();
    const { name, hospitalAddress, hospitalName } = userData;

    const data = {
      ...motherInfo,
      ...emergencyInfo,
      uid: user.uid,
      attendantName: name || '',
      hospitalAddress: hospitalAddress || '',
      hospitalName: hospitalName || '',
      createdAt: new Date(),
    };

    try {
      const docRef = doc(this.firestore, 'mothers', this.motherId!); // Non-null assertion because motherId is not null
      await updateDoc(docRef, data);

      this.notificationMessage = 'Mother and emergency info updated successfully!';
      this.notificationType = 'success';

      this.motherForm.reset();
      this.emergencyForm.reset();
      this.showEmergency = false;

      this.router.navigate(['/ob-gyne/prenatal']);
    } catch (error) {
      console.error(error);
      this.notificationMessage = 'Failed to update data. Please try again.';
      this.notificationType = 'error';
    }

    setTimeout(() => {
      this.notificationMessage = '';
    }, 4000);
  }
  proceedToEmergency(): void {
    if (this.motherForm.invalid) {
      this.motherForm.markAllAsTouched();
      return;
    }
    this.showEmergency = true; // Show the emergency info form when "Next" is clicked
  }
  atLeastOneEmergency(): boolean {
    const { spouseContact, motherContact, fatherContact } = this.emergencyForm.value;
    return !!(spouseContact || motherContact || fatherContact);
  }

  backToMotherForm(): void {
    this.showEmergency = false;
  }



}
