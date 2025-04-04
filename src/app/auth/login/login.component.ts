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

  async loginWithGoogle(): Promise<void> {
    this.loading = true;
    try {
      const user = await this.authService.googleSignIn();

      const hasObGyneData = await this.authService.checkObGyneData(user.uid);
      if (!hasObGyneData) {
        this.router.navigate(['/auth/setup-user']);
      } else {
        this.redirectUser(user.email ?? '');
      }
    } catch (error: any) {
      window.alert(error);
    } finally {
      this.loading = false;
    }
  }



  async loginWithFacebook() {
    window.alert('Facebook login is unavailable. Please try again next year.');
  }

  private redirectUser(email: string): void {
    if (!email) return;
    if (email === this.authService.getAdminEmail()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/ob-gyne']);
    }
  }
}
