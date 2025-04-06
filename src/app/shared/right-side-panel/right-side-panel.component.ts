import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-right-side-panel',
  standalone: false,
  templateUrl: './right-side-panel.component.html',
  styleUrls: ['./right-side-panel.component.scss']
})
export class RightSidePanelComponent implements OnInit {
  user$: Observable<User | null>;
  dropdownOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.authService.logout();
  }
}
