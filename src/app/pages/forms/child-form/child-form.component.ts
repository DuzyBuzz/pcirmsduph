import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Child } from '../../../models/child.model';

@Component({
  selector: 'app-child-form',
  standalone: false,
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss'],
})
export class ChildFormComponent {
  @Input() childForm!: Child; // The '!' tells TypeScript that this will be assigned.

  @Output() save = new EventEmitter<void>();

  saveChild() {
    this.save.emit();
  }
}
