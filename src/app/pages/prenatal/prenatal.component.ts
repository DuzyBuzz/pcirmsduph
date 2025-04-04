import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, addDoc, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Component({
  selector: 'app-prenatal',
  standalone: false,
  templateUrl: './prenatal.component.html',
  styleUrls: ['./prenatal.component.scss']
})
export class PrenatalComponent implements OnInit, OnDestroy {
  motherForm!: FormGroup;
  emergencyForm!: FormGroup;
  showEmergency = false;
  mothers: any[] = [];
  searchTerm: string = '';
  filterByOwn: boolean = false;
  showContextMenu = false;
  showDeleteModal = false;
  confirmName: string = '';
  selectedMother: any = null;
  contextMenuPosition = { x: '0px', y: '0px' }; // To hold the position of the context menu
  showPermissionError = false;
  filteredMothersList: any[] = [];
  isSidebarHidden: boolean = false;
  selectedMotherId: string | null = null;





  toggleActionButtons(motherId: string) {
    this.selectedMotherId = this.selectedMotherId === motherId ? null : motherId;
  }


  auth = inject(Auth); // Inject Firebase Authentication
  private clickListener!: () => void;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.motherForm = this.fb.group({
      name: ['', Validators.required],
      homeAddress: ['', Validators.required],
      contactNumber: ['', Validators.required],
      lastMenstruationDate: ['', Validators.required],
      dueDate: ['', Validators.required]
    });

    this.emergencyForm = this.fb.group({
      spouseName: [''],
      spouseContact: [''],
      parentName: [''],
      parentContact: [''],
      fatherName: [''],
      fatherContact: ['']
    });

    this.loadMothers();
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => this.onDocumentClick(event));
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
  }
    // Set selectedMotherId when a mother is clicked
  selectMother(motherId: string): void {
    this.selectedMotherId = motherId;
    console.log('Selected Mother ID parent:', this.selectedMotherId);

    this.isSidebarHidden = true; // hide the sidebar and show pregnancy record component
  }

  // Method to toggle the sidebar visibility
  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;

  }

  // Add a method to prevent closing when clicking inside the context menu
  onContextMenuClick(event: MouseEvent): void {
    event.stopPropagation(); // Prevents click from propagating to the document click listener
  }

  onDocumentClick(event: MouseEvent): void {
    const contextMenuElement = this.el.nativeElement.querySelector('.absolute');
    if (contextMenuElement && !contextMenuElement.contains(event.target as Node)) {
      this.closeContextMenu();
    }
  }

  atLeastOneEmergency(): boolean {
    const { spouseContact, parentContact, fatherContact } = this.emergencyForm.value;
    return spouseContact || parentContact || fatherContact;
  }

  async submitMother() {
    if (this.motherForm.valid) {
      this.showEmergency = true;
    }
  }

  async submitAll() {
    if (this.atLeastOneEmergency()) {
      const motherInfo = this.motherForm.value;
      const emergencyInfo = this.emergencyForm.value;
      const data = { ...motherInfo, ...emergencyInfo };

      const ref = collection(this.firestore, 'mothers');
      await addDoc(ref, data);

      alert('Mother and emergency info saved successfully!');
      this.motherForm.reset();
      this.emergencyForm.reset();
      this.showEmergency = false;

      this.loadMothers(); // reload list
    } else {
      alert('Please provide at least one emergency contact.');
    }
  }

  openDeleteModal(mother: any): void {
    const currentUserUid = this.auth.currentUser?.uid;
    if (mother.uid !== currentUserUid) {
      this.showPermissionError = true;
      return;
    }
    this.selectedMother = mother;
    this.showDeleteModal = true;
    this.showContextMenu = false;
  }

  loadMothers(): void {
    const ref = collection(this.firestore, 'mothers');
    collectionData(ref, { idField: 'id' }).subscribe(data => {
      this.mothers = data;
    });
  }
  // Method to handle filter changes
  onFilterChange(): void {
    this.filteredMothersList = this.filteredMothers();
  }

  filteredMothers() {
    const currentUserUid = this.auth.currentUser?.uid;

    let filtered = this.mothers;

    if (this.filterByOwn) {
      // Filter only the mother's records belonging to the current user
      filtered = filtered.filter(mother => mother.uid === currentUserUid);
    }
    if (this.searchTerm.trim()) {
      // Filter based on search term if provided
      filtered = filtered.filter(mother =>
        mother.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    return filtered;
  }


  // Update the context menu position based on mouse event
  openContextMenu(event: MouseEvent, mother: any): void {
    event.preventDefault(); // Prevent the default right-click context menu

    this.selectedMother = mother;

    // Check if the logged-in user UID matches the mother UID
    const currentUserUid = this.auth.currentUser?.uid;
    if (mother.uid !== currentUserUid) {
      this.showPermissionError = true;
      return;
    }

    this.showContextMenu = true;

    // Set the position of the context menu
    this.contextMenuPosition = {
      x: `${event.pageX + 5}px`, // 5px offset to the right of the cursor
      y: `${event.pageY + 5}px`, // 5px offset below the cursor
    };
  }

  closeContextMenu(): void {
    this.showContextMenu = false;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.confirmName = '';
  }

  async deleteMother(): Promise<void> {
    if (this.confirmName === this.selectedMother.name) {
      try {
        const ref = doc(this.firestore, 'mothers', this.selectedMother.id);
        await deleteDoc(ref);
        alert('Mother record deleted successfully!');
        this.closeDeleteModal();
        this.loadMothers();
      } catch (error) {
        console.error('Error deleting mother:', error);
        alert('Failed to delete the record. Please try again.');
      }
    }
  }

  openEditForm(mother: any): void {
    const currentUserUid = this.auth.currentUser?.uid;
    if (mother.uid !== currentUserUid) {
      this.showPermissionError = true;
      return;
    }
    console.log('Edit', mother);
    this.showContextMenu = false;
    // Implement edit logic here
  }

  // Close the permission error modal
  closePermissionError(): void {
    this.showPermissionError = false;
  }

}
