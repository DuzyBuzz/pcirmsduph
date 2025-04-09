import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { MothersService } from '../../../services/mother/mother-service.service';
import { AuthService } from '../../../auth/auth.service';
import { doc, updateDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { PrenatalEditRecordComponent } from "../../forms/prenatal-edit-record/prenatal-edit-record.component";

@Component({
  selector: 'app-mothers-pregnancy-record',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, PrenatalEditRecordComponent],
  templateUrl: './mothers-pregnancy-record.component.html',
  styleUrls: ['./mothers-pregnancy-record.component.scss']
})
export class MothersPregnancyRecordComponent implements OnChanges, OnInit {
  currentUserUid: string | null = null;  // Allow null type
  pregnancyForm: FormGroup;
  records: any[] = [];
  motherData: any;
  showSubmittedRecords = true;
  loading = true;
  @Input() motherId: string | null = null;  // motherId as an Input
  error: string | null = null; // Error property to show error messages
  successMessage: string | null = null;
  noRecordsFound = false;
  showConfirmationModal = false;
  formDataPreview: any = {}; // Holds form data for preview in modal
  showDeleteModal: boolean = false;
  selectedRecord: any = null;
  confirmDate: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  selectedMother: any = null;
  showPrenatalDeleteModal = false;
selectedRecordIndex: number = -1;
confirmRecordDate: string = '';
selectedPrenatalRecordId: string | null = null;
isModalOpen: boolean = false;







  columns = [
    { key: 'date', label: 'Date', type: 'date', placeholder: '', error: 'Invalid date' },
    { key: 'aog', label: 'AOG', type: 'text', placeholder: 'e.g. 12 weeks' },
    { key: 'bp', label: 'BP', type: 'text', placeholder: 'e.g. 120/80' },
    { key: 'fh', label: 'FH', type: 'text', placeholder: 'e.g. 32cm' },
    { key: 'fgb', label: 'FGB', type: 'text', placeholder: '' },
    { key: 'wtPresIe', label: 'Wt/Pres/IE', type: 'text', placeholder: '' },
    { key: 'mvtFa', label: 'MVT/FA', type: 'text', placeholder: '' },
    { key: 'iron', label: 'Iron', type: 'text', placeholder: '' },
    { key: 'calcium', label: 'Calcium', type: 'text', placeholder: '' },
    { key: 'vitCMoringa', label: 'Vit C/Moringa', type: 'text', placeholder: '' },
    { key: 'dydrogesterone', label: 'Dydrogesterone', type: 'text', placeholder: '' },
    { key: 'progesterone', label: 'Progesterone', type: 'text', placeholder: '' },
    { key: 'isoxsuprine', label: 'Isoxsuprine', type: 'text', placeholder: '' },
    { key: 'milkOthers', label: 'Milk/Others', type: 'text', placeholder: '' },
    { key: 'coMgt', label: 'Co-Mgt', type: 'text', placeholder: '' },
    { key: 'ttTd', label: 'TT/TD', type: 'text', placeholder: '' },
    { key: 'tdap', label: 'TDAP (27-36w)', type: 'text', placeholder: '' },
    { key: 'spt', label: 'SPT', type: 'text', placeholder: '' },
    { key: 'bloodRh', label: 'Blood & Rh', type: 'text', placeholder: '' },
    { key: 'rpr', label: 'RPR', type: 'text', placeholder: '' },
    { key: 'hbsag', label: 'HBsAG', type: 'text', placeholder: '' },
    { key: 'cbc', label: 'CBC', type: 'text', placeholder: '' },
    { key: 'urinalysis', label: 'Urinalysis', type: 'text', placeholder: '' },
    { key: 'fbs', label: 'FBS/75 OGTT', type: 'text', placeholder: '' },
    { key: 'rbs', label: 'RBS', type: 'text', placeholder: '' },
    { key: 'ultrasound', label: 'Ultrasound', type: 'text', placeholder: '' },
    { key: 'otherLabs', label: 'Other Labs', type: 'text', placeholder: '' },
    { key: 'followUp', label: 'Follow Up', type: 'date', placeholder: '' },
  ];

  constructor(
    private fb: FormBuilder,
    private mothersService: MothersService,
    private authService: AuthService,
    private firestore: Firestore
  ) {
    this.pregnancyForm = this.fb.group({});
    this.initializeFormControls();
  }

  ngOnInit() {
    this.loadRecords();

    // Check after 60 seconds if still empty
    setTimeout(() => {
      if (this.records.length === 0 && this.loading) {
        this.noRecordsFound = true;
        this.loading = false;
      }
    }, 60000); // 1 minute

    this.getCurrentUserUid(); // Retrieve the current user's UID on component initialization
  }
      // This method is called to close the modal
      closeModal(): void {
        this.isModalOpen = false; // Close the modal
        this.selectedRecord = null; // Optionally reset selectedMotherId
      }

  ngOnChanges(): void {
    if (this.motherId) {
      this.mothersService.getMotherById(this.motherId).subscribe({
        next: (data) => {
          this.motherData = data;
          this.loadPrenatalRecords(); // load the records
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to fetch mother data.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Mother ID is missing.';
      this.loading = false;
    }
  }

  // Fetch currentUserUid as an async call
  async getCurrentUserUid() {
    try {
      this.currentUserUid = await this.authService.getCurrentUserId();
    } catch (error) {
      this.error = 'Failed to fetch user UID.';
    }
  }


  loadRecords() {
    // Replace with actual Firestore fetch logic
    setTimeout(() => {
      // Simulate loading data
      // this.records = [...]; // Uncomment and fill to test with data
      this.loading = false;
    }, 2000); // Simulated fetch time
  }

  // Method to check if the logged-in user can edit or delete the record
  canEditOrDelete(record: any): boolean {
    // Compare the logged-in user's UID with the mother's UID
    return record.motherUid === this.currentUserUid; // Use the async fetched UID
  }

  openConfirmModal() {
    if (this.pregnancyForm.valid) {
      // Prepare form data for preview
      this.formDataPreview = { ...this.pregnancyForm.value };
      this.showConfirmationModal = true;
    }
  }

  async checkIfUserCanEditOrDelete(): Promise<boolean> {
    const currentUserId = await this.authService.getCurrentUserId(); // Get current user's UID
    return currentUserId === this.motherData?.uid; // Compare with mother's UID
  }

  loadPrenatalRecords() {
    this.mothersService.getPrenatalRecords(this.motherId!).then(records => {
      this.records = records.map(rec => ({ id: rec.id, ...rec.data }));
    });
  }

  initializeFormControls() {
    for (const column of this.columns) {
      const defaultValue = column.key === 'date'
        ? new Date().toISOString().split('T')[0] // Default date to today
        : '';
      this.pregnancyForm.addControl(column.key, this.fb.control(defaultValue));
    }
  }

  toggleSubmittedView() {
    this.showSubmittedRecords = !this.showSubmittedRecords;
  }

  onEditRecord(index: number) {
    const record = this.records[index];
    this.selectedRecord = record?.id; // assuming each record has an `id`
    this.isModalOpen = true;
    console.log('mother id:'+this.motherId);
  }

  deletePrenatalRecord() {
    if (this.confirmRecordDate !== this.selectedRecord?.date) return;

    const motherDocRef = doc(this.firestore, 'mothers', this.selectedMother.id);
    const updatedRecords = [...this.selectedMother.prenatalRecords];
    updatedRecords.splice(this.selectedRecordIndex, 1);

    updateDoc(motherDocRef, { prenatalRecords: updatedRecords }).then(() => {
      this.selectedMother.prenatalRecords = updatedRecords;
      this.closePrenatalDeleteModal();
    });
  }
  closePrenatalDeleteModal() {
    this.showPrenatalDeleteModal = false;
    this.selectedRecord = null;
    this.selectedRecordIndex = -1;
    this.confirmRecordDate = '';
  }


  onDeleteRecord(index: number, record: any) {
    this.selectedRecordIndex = index;
    this.selectedRecord = record;
    this.confirmRecordDate = '';
    this.showPrenatalDeleteModal = true;
  }


  cancelConfirmation() {
    this.showConfirmationModal = false;
  }

  confirmAndSubmit() {
    if (!this.motherId) {
      this.error = 'Mother ID is missing.';
      return;
    }

    // Retrieve the logged-in user's UID from AuthService
    this.authService.getCurrentUserId().then(uid => {
      if (!uid) {
        this.error = 'User not logged in.';
        return;
      }

      const formValue = this.pregnancyForm.value;
      formValue.uid = uid; // Add the logged-in user's UID to the form data

      // Ensure motherId is not null before proceeding
      if (this.motherId) {
        // Proceed with adding the prenatal record to Firestore
        this.mothersService.addPrenatalRecord(this.motherId, formValue)
          .then((res) => {
            this.records.push({ id: res.id, ...res.data }); // Include Firestore ID
            this.pregnancyForm.reset({
              date: new Date().toISOString().split('T')[0]
            });
            this.error = null;
            this.successMessage = 'Record saved successfully!';
            this.showConfirmationModal = false;
            setTimeout(() => this.successMessage = '', 7000);
          })
          .catch(error => {
            console.error(error);
            this.error = 'Failed to save the prenatal record.';
          });
      } else {
        this.error = 'Mother ID is missing or invalid.';
      }
    });
  }
}
