import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  loginWithGoogle() {
    this.loading = true;
    this.authService.googleSignIn()
      .then(async (user: User) => {
        this.loading = false;
        const isComplete = await this.authService.isProfileComplete(user.uid);
        if (!isComplete) {
          this.router.navigate(['/auth/setup-user']);
        } else {
          this.redirectUser(user.email);
        }
      })
      .catch(errorMessage => {
        this.loading = false;
        window.alert(errorMessage);
      });
  }

  async loginWithFacebook() {
    window.alert('Facebook login is unavailable. Please try again next year.');
  }

  private redirectUser(email: string | null): void {
    if (!email) return;
    if (email === this.authService.getAdminEmail()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/ob-gyne']);
    }
  }
}
