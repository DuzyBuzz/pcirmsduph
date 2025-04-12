import { CommonModule } from '@angular/common';
import { Component, Input, input, NgModule } from '@angular/core';

@Component({
  selector: 'app-spinnner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinnner.component.html',
  styleUrl: './spinnner.component.scss'
})
export class SpinnnerComponent {
  @Input() navigating: boolean = false;
  @Input() spinnerMessage: string | null = null;
}
