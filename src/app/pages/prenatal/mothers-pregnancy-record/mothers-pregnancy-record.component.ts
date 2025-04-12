import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { MothersService } from '../../../services/mother/mother-service.service';
import { AuthService } from '../../../auth/auth.service';
import { doc, updateDoc } from 'firebase/firestore';
import { deleteDoc, Firestore } from '@angular/fire/firestore';
import { PrenatalEditRecordComponent } from "../../forms/prenatal-edit-record/prenatal-edit-record.component";
import * as XLSX from 'xlsx';
import { SpinnnerComponent } from '../../../shared/core/spinnner/spinnner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mothers-pregnancy-record',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, PrenatalEditRecordComponent, SpinnnerComponent],
  templateUrl: './mothers-pregnancy-record.component.html',
  styleUrls: ['./mothers-pregnancy-record.component.scss']
})
export class MothersPregnancyRecordComponent implements OnChanges, OnInit {
  currentUserUid: string | null = null;  // Allow null type
  pregnancyForm: FormGroup;
  records: any[] = [];
  motherData: any;
  showSubmittedRecords = true;
  showSubmittedExelRecords = true;
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
isRecordsLoaded: boolean = false;
navigating = false;
spinnerMessage = '';





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
    private firestore: Firestore,
    private router: Router
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
              if (this.motherData) {
                this.loadPrenatalRecords();  // Proceed with record loading only after motherData is fetched
              }
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


  exportToExcel(): void {
    const wsData: any[][] = [];

    // --- Patient Info Header
    wsData.push(['', '', '', '', '', '', '', 'Patient Information']);
    wsData.push([
      'Name', 'Home Address', 'Age', 'G', 'P', 'Hx', 'LMP', 'Ultrasound', 'Contact Number'
    ]);
    wsData.push([
      this.motherData.name,
      this.motherData.address,
      this.motherData.age,
      this.motherData.g,
      this.motherData.p,
      this.motherData.hx,
      this.motherData.lmp,
      this.motherData.ultrasound,
      this.motherData.contactNumber
    ]);
    wsData.push([]);

    // --- Prenatal Records Header
    wsData.push(['Prenatal Records']);

    // --- Prepare horizontal records
    const fields = [
      'Date:', 'AOG:', 'BP:', 'FH:', 'FGB:', 'Wt/Pres/IE:', 'MVT/FA:', 'Iron:', 'Calcium:', 'Vit C/Moringa:',
      'Dydrogesterone:', 'Progesterone:', 'Isoxsuprine:', 'Milk/Others:', 'Co-Mgt:', 'TT/TD:', 'TDAP (27-36w):',
      'SPT:', 'Blood & Rh:', 'RPR:', 'HBsAG:', 'CBC:', 'Urinalysis:', 'FBS/75 OGTT:', 'RBS:', 'Ultrasound:',
      'Other Labs', 'Follow Up'
    ];

    const horizontalRecords: any[][] = [];

    // Push fields as first column
    for (let i = 0; i < fields.length; i++) {
      horizontalRecords.push([fields[i]]);
    }

    // Add each record’s value as a new column
    for (const record of this.records) {
      const values = [
        record.date,
        record.aog,
        record.bp,
        record.fh,
        record.fgb,
        record.wtPresIe,
        record.mvtFa,
        record.iron,
        record.calcium,
        record.vitCMoringa,
        record.dydrogesterone,
        record.progesterone,
        record.isoxsuprine,
        record.milkOthers,
        record.coMgt,
        record.ttTd,
        record.tdap,
        record.spt,
        record.bloodRh,
        record.rpr,
        record.hbsag,
        record.cbc,
        record.urinalysis,
        record.fbs,
        record.rbs,
        record.ultrasound,
        record.otherLabs,
        record.followUp
      ];

      for (let i = 0; i < values.length; i++) {
        horizontalRecords[i].push(values[i]);
      }
    }

    // Add horizontal records to the sheet
    wsData.push(...horizontalRecords);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);

    // Apply merges
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Merge for "Patient Information"
      { s: { r: 4, c: 0 }, e: { r: 4, c: this.records.length } } // Merge for "Prenatal Records"
    ];

    // Auto column widths
    ws['!cols'] = new Array(this.records.length + 1).fill({ wch: 18 });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Prenatal');
    const g = this.motherData.g;

    XLSX.writeFile(wb, this.motherData.name +"_Gravida_"+g+"_Prenatal Record.xlsx");
  }

  // Fetch currentUserUid as an async call
  async getCurrentUserUid() {
    try {
      this.currentUserUid = await this.authService.getCurrentUserId();
      if (!this.currentUserUid) {
        this.error = 'User is not logged in or UID could not be fetched.';
      }
    } catch (error) {
      this.error = 'Failed to fetch user UID.';
    }
  }



  loadRecords() {
    // Replace with actual Firestore fetch logic
    setTimeout(() => {
      // Simulate loading data
      // this.records = [...]; // Uncomment and fill to test with data
      this.isRecordsLoaded = true;
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
    if (!this.motherData || !this.selectedRecord) {
      this.error = 'No record selected for deletion.';
      return;
    }

    if (this.confirmRecordDate !== this.selectedRecord.date) {
      this.error = 'Confirmed date does not match the selected record.';
      return;
    }

    const prenatalRecordDocRef = doc(
      this.firestore,
      `mothers/${this.motherId}/prenatalRecords/${this.selectedRecord.id}`
    );

    deleteDoc(prenatalRecordDocRef)
    .then(() => {
      this.spinnerMessage = 'Deleting prenatal record...';
      this.navigating = true;

      // Filter out the deleted record from the local list
      this.records = this.records.filter(
        (record: { id: any }) => record.id !== this.selectedRecord?.id
      );

      // Close the delete confirmation modal
      this.closePrenatalDeleteModal();

      // Delay to allow spinner feedback before navigation
      setTimeout(() => {
        this.navigating = false;

        // Navigate to a fresh state or list view (adjust route as needed)
        this.router.navigate(['/HCP/prenatal']); // Example
      }, 1500);
    })
    .catch((error) => {
      this.error = 'Error deleting record: ' + error.message;
      this.navigating = false;
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
    console.log("delete");
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
            this.navigating = true;
            this.spinnerMessage = 'Recording...'
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
