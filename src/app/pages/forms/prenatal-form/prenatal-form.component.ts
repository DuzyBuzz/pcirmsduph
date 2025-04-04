import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-prenatal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prenatal-form.component.html',
  styleUrls: ['./prenatal-form.component.scss']
})
export class PrenatalFormComponent implements OnInit {
  motherForm!: FormGroup;
  emergencyForm!: FormGroup;
  showEmergency = false;
  auth = inject(Auth);
  mothers: any[] = [];

  constructor(private fb: FormBuilder, private firestore: Firestore) {}

  ngOnInit(): void {
    this.motherForm = this.fb.group({
      name: ['', Validators.required],
      homeAddress: ['', Validators.required],
      contactNumber: ['', Validators.required],
      lastMenstruationDate: ['', Validators.required],
      dueDate: ['', Validators.required]
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
  emergencyFields = [
    { name: 'spouseName', label: 'Spouse Name', type: 'text' },
    { name: 'spouseContact', label: 'Spouse Contact Number', type: 'tel' },
    { name: 'parentName', label: 'Parent/Guardian Name', type: 'text' },
    { name: 'parentContact', label: 'Parent/Guardian Contact', type: 'tel' },
    { name: 'fatherName', label: 'Father’s Name', type: 'text' },
    { name: 'fatherContact', label: 'Father’s Contact Number', type: 'tel' },
  ];
  isInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }


  submitMother() {
    if (this.motherForm.invalid) {
      this.motherForm.markAllAsTouched();
      return;
    }
    this.showEmergency = true;
  }

  atLeastOneEmergency(): boolean {
    const { spouseContact, parentContact, fatherContact } = this.emergencyForm.value;
    return !!(spouseContact || parentContact || fatherContact);
  }

  async submitAll(): Promise<void> {
    if (!this.atLeastOneEmergency()) {
      alert('Please provide at least one emergency contact.');
      return;
    }
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      console.error('No authenticated user.');
      return;
    }

    try {
      const motherInfo = this.motherForm.value;
      const emergencyInfo = this.emergencyForm.value;
      const data = { ...motherInfo, ...emergencyInfo,
        uid: currentUser.uid,
        createdAt: new Date().toISOString() };

      const ref = collection(this.firestore, 'mothers');
      await addDoc(ref, data);

      alert('Mother and emergency info saved successfully!');
      this.motherForm.reset();
      this.emergencyForm.reset();
      this.showEmergency = false;
      this.loadMothers();
    } catch (error) {
      console.error('Error saving mother info:', error);
      alert('Something went wrong while saving. Please try again.');
    }
  }

  loadMothers(): void {
    const ref = collection(this.firestore, 'mothers');
    collectionData(ref, { idField: 'id' }).subscribe(data => {
      this.mothers = data;
    });
  }
}
