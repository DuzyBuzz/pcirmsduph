import { Component } from '@angular/core';

@Component({
  selector: 'app-left-side-panel',
  standalone: false,
  templateUrl: './left-side-panel.component.html',
  styleUrl: './left-side-panel.component.scss'
})
export class LeftSidePanelComponent {
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

}
