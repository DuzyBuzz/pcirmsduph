import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ImmunizationService } from '../../services/immunization/immunization.service';
import { Child } from '../../models/child.model';  // Import the full Child model

@Component({
  selector: 'app-register-children',
  standalone: false,
  templateUrl: './register-children.component.html',
  styleUrls: ['./register-children.component.scss'],
})
export class RegisterChildrenComponent implements OnInit {
  children$!: Observable<Child[]>;  // List of children
  newChild: Partial<Child> = {}; // Initialize newChild with the properties of Child model
  isEditMode = false;
  editingChildId: string | null = null;
  showModal = false;

  constructor(private immunizationService: ImmunizationService) {}

  ngOnInit(): void {
    this.loadChildren();  // Initialize the list of children on component load
  }

  openAddModal(): void {
    this.newChild = {};  // Reset the form for adding new child data
    this.isEditMode = false;
    this.showModal = true;
  }

  openEditModal(child: Child): void {
    // Pre-fill the form with the existing child data when editing
    this.newChild = { 
      childName: child.childName, 
      birthDate: child.birthDate, 
      guardianName: child.guardianName,
      // Include other fields as necessary
    };
    this.isEditMode = true;
    this.editingChildId = child.id!;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  async saveChild(): Promise<void> {
    // Basic validation for required fields
    if (!this.newChild.childName || !this.newChild.birthDate || !this.newChild.guardianName) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      if (this.isEditMode && this.editingChildId) {
        // Update the existing child
        await this.immunizationService.updateChild(this.editingChildId, this.newChild);
      } else {
        // Add a new child
        await this.immunizationService.addChild(this.newChild);
      }
      // Reload the list of children after saving and close the modal
      this.loadChildren();
      this.closeModal();
    } catch (error) {
      console.error('Error saving child:', error);
      alert('An error occurred while saving the child data.');
    }
  }

  async deleteChild(id: string): Promise<void> {
    // Delete the selected child and reload the list
    await this.immunizationService.deleteChild(id);
    this.loadChildren();
  }

  loadChildren(): void {
    // Fetch the list of children from the service
    this.children$ = this.immunizationService.getChildren();
  }
}
