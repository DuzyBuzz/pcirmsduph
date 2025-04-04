import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router, private auth: Auth) {}

  login() {
    if (!this.email || !this.password) {
      window.alert("Please enter both email and password.");
      return;
    }

    this.loading = true;
    this.authService.loginWithCredentials(this.email, this.password)
      .then(async (user) => {
        this.loading = false;
        const hasObGyneData = await this.authService.checkObGyneData(user.uid);
        if (!hasObGyneData) {
          this.router.navigate(['/setup-ob-gyne']); // Redirect to profile setup page
        } else {
          this.redirectUser(user.email);
        }
      })
      .catch(errorMessage => {
        this.loading = false;
        window.alert(errorMessage);
      });
  }
  loginWithGoogle() {
    this.loading = true;
    this.authService.googleSignIn()
      .then(async (user) => {
        this.loading = false;
        const hasObGyneData = await this.authService.checkObGyneData(user.uid);
        if (!hasObGyneData) {
          this.router.navigate(['/setup-user']); // Redirect to profile setup page
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
    window.alert('Facebook login feature is unavalable right now. Please try again next year.');
  }

  private redirectUser(email: string | null) {
    if (!email) return;
    if (email === this.authService.getAdminEmail()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/ob-gyne']);
    }
  }
}
