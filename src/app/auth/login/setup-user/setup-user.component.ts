import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-setup-user',
  imports: [ReactiveFormsModule],
  templateUrl: './setup-user.component.html',
  styleUrl: './setup-user.component.scss'
})
export class SetupUserComponent {
  obForm!: FormGroup;
  uid: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obForm = this.fb.group({
      name: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      hospitalName: ['', Validators.required],
      hospitalAddress: ['', Validators.required]
    });

    this.getUserUid();
  }

  async getUserUid() {
    const user$ = user(this.auth);
    const currentUser = await firstValueFrom(user$);
    if (currentUser) {
      this.uid = currentUser.uid;
    }
  }

  async submitForm() {
    if (this.obForm.invalid || !this.uid) return;

    const obInfoRef = doc(this.firestore, `users/${this.uid}`);
    await setDoc(obInfoRef, this.obForm.value);

    alert('Information submitted successfully!');
    this.obForm.reset();
    this.router.navigate(['/ob-gyne']);
  }
}
