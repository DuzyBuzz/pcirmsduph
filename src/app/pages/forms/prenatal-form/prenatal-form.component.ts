import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firestore, collection, addDoc, collectionData, doc, getDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SpinnnerComponent } from '../../../shared/core/spinnner/spinnner.component';

@Component({
  selector: 'app-prenatal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,SpinnnerComponent],
  templateUrl: './prenatal-form.component.html',
})
export class PrenatalFormComponent implements OnInit {
  motherForm!: FormGroup;
  emergencyForm!: FormGroup;
  showEmergency = false;
  showMotherConfirmModal = false;
  showFinalConfirmModal = false;
  navigating  = false;
  spinnerMessage = '';

  auth = inject(Auth);
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  mothers: any[] = [];

  emergencyFields = [
    { name: 'spouseName', label: 'Spouse Name', type: 'text' },
    { name: 'spouseContact', label: 'Spouse Contact Number', type: 'tel' },
    { name: 'motherName', label: 'Mother’s Name', type: 'text' },
    { name: 'MotherContact', label: 'Mother Contact', type: 'tel' },
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
      g: ['', Validators.required],
      p: ['', Validators.required],
      hx: ['', Validators.required],
      lmp: ['', Validators.required],
      dueDate: ['', Validators.required],
      ultrasound: ['']
    });

    this.emergencyForm = this.fb.group({
      spouseName: [''],
      spouseContact: [''],
      motherName: [''],
      motherContact: [''],
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


    // Validate that at least one emergency contact is provided
    if (!this.atLeastOneEmergency()) {
      this.notificationMessage = 'Please provide at least one emergency contact.';
      this.notificationType = 'error';
      return;
    }

    const user = this.auth.currentUser;

    if (!user) {
      this.notificationMessage = 'User not authenticated. Please log in again.';
      this.notificationType = 'error';
      return;
    }

    // Check if there's already a matching mother in the database
    const motherName = this.motherForm.value.name;
    const motherGravida = this.motherForm.value.g;  // Gravida (G)

    try {
      const mothersRef = collection(this.firestore, 'mothers');
      const q = query(mothersRef,
        where('name', '==', motherName),
        where('g', '==', motherGravida)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        this.notificationMessage = `A record already exists for a mother named "${motherName}" with Gravida "${motherGravida}". Please verify the information or edit the existing record.`;
        this.notificationType = 'error';
        return;
      }

      // If no matching record exists, save the new data
      const userRef = doc(this.firestore, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        this.notificationMessage = 'User data not found. Please check your account information.';
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

      // Add the new mother's record to Firestore
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
      this.notificationMessage = 'Failed to save data. Please try again later.';
      this.notificationType = 'error';
    }
    this.notificationMessage = '';

    this.navigating = true;
    this.spinnerMessage = 'Saving Patient Information...';
    
    setTimeout(() => {
      this.router.navigate(['/HCP/prenatal']).then(() => {
        this.navigating = false; // Reset after navigation completes
      });
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
