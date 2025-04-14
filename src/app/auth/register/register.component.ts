import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    this.errorMessage = '';
    this.loading = true;
    try {
      await this.authService.registerWithEmail(this.email, this.password, this.name);
      this.router.navigate(['/dashboard']); // ✅ Redirect to dashboard
    } catch (error: any) {
      this.errorMessage = error?.message || 'Registration failed'; // ✅ Ensure error message
    } finally {
      this.loading = false;
    }
  }

  async registerWithGoogle() {
    this.errorMessage = '';
    this.loading = true;
    try {
      await this.authService.googleSignIn();
      this.router.navigate(['/dashboard']); // ✅ Redirect after success
    } catch (error: any) {
      this.errorMessage = error?.message || 'Google sign-in failed';
    } finally {
      this.loading = false;
    }
  }
}
