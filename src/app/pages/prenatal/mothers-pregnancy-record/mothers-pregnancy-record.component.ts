import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { MothersService } from '../../../services/mother/mother-service.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-mothers-pregnancy-record',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mothers-pregnancy-record.component.html',
  styleUrls: ['./mothers-pregnancy-record.component.scss']
})
export class MothersPregnancyRecordComponent implements OnChanges, OnInit{
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
    private authService: AuthService
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
    const currentUserId = this.authService.getCurrentUserId();
    console.log(currentUserId)
    return record.motherUid === currentUserId; // If they match, return true, otherwise false
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
    this.checkIfUserCanEditOrDelete().then(canEdit => {
      if (canEdit) {
        const record = this.records[index];
        this.pregnancyForm.patchValue(record);
        this.records.splice(index, 1); // Remove the record so it can be replaced after editing
      } else {
        this.error = 'You do not have permission to edit this record. You can only modify your own records.';
      }
    });
  }

  onDeleteRecord(index: number) {
    this.checkIfUserCanEditOrDelete().then(canDelete => {
      if (canDelete) {
        const record = this.records[index];
        const confirmed = confirm('Are you sure you want to delete this record?');
        if (confirmed && record.id && this.motherId) {
          this.mothersService.deletePrenatalRecord(this.motherId, record.id)
            .then(() => {
              this.records.splice(index, 1);
              this.successMessage = 'Record deleted successfully!';
              setTimeout(() => this.successMessage = '', 2000);
            })
            .catch(error => {
              console.error(error);
              this.error = 'Failed to delete the record.';
            });
        }
      } else {
        this.error = 'You do not have permission to delete this record. You can only delete your own records.';
      }
    });
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
