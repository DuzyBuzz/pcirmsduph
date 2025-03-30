import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  imports: [],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
