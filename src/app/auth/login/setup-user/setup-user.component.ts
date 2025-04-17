import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BusinessAddressMapComponent } from '../../../shared/core/business-address-map/business-address-map.component';

@Component({
  selector: 'app-setup-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BusinessAddressMapComponent],
  templateUrl: './setup-user.component.html',
  styleUrls: ['./setup-user.component.scss']
})
export class SetupUserComponent implements OnInit {
  obForm!: FormGroup;
  uid: string | null = null;
  showMapModal = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}
  openMapModal() {
    this.showMapModal = true;
  }
    /**
   * Closes the business address map modal.
   */
    closeMapModal() {
      this.showMapModal = false;
    }

    /**
     * Sets the selected address from the map modal.
     * @param address Address returned from the child map component.
     */
    setAddress(address: string) {
      this.obForm.patchValue({ hospitalAddress: address });
      this.closeMapModal();
    }


  async ngOnInit(): Promise<void> {
    // Form setup
    this.obForm = this.fb.group({
      name: ['', Validators.required],
      contactNumber: ['', Validators.required],
      hospitalName: ['', Validators.required],
      hospitalAddress: ['', Validators.required]
    });

    // Auth check
    const currentUser = await firstValueFrom(user(this.auth));
    if (!currentUser) {
      this.router.navigate(['/auth/login']); // 🔁 Redirect if not logged in
    } else {
      this.uid = currentUser.uid;
    }
  }

  async submitForm() {
    if (this.obForm.invalid || !this.uid) return;

    const obInfoRef = doc(this.firestore, `users/${this.uid}`);
    await setDoc(obInfoRef, this.obForm.value, { merge: true }); // 🔁 use merge to avoid overwriting other fields

    alert('Information submitted successfully!');
    this.obForm.reset();
    this.router.navigate(['/HCP']);
  }
}
