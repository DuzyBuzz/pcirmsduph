import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { MothersService } from '../../../services/mother/mother-service.service';

@Component({
  selector: 'app-mothers-pregnancy-record',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './mothers-pregnancy-record.component.html',
  styleUrls: ['./mothers-pregnancy-record.component.scss']
})
export class MothersPregnancyRecordComponent implements OnInit {
  pregnancyForm: FormGroup;
  records: any[] = [];
  motherData: any;
  showSubmittedRecords = false;
  loading = true;
  @Input() motherId: string | null = null;  // motherId as an Input
  error: string | null = null; // Error property to show error messages
  successMessage: string | null = null;


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
    { key: 'cirCMorings', label: 'Cir C/Morings', type: 'text', placeholder: '' },
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
    { key: 'gbsag', label: 'GBSAG', type: 'text', placeholder: '' },
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
    private mothersService: MothersService
  ) {
    this.pregnancyForm = this.fb.group({});
    this.initializeFormControls();
  }

  ngOnInit(): void {
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
    this.pregnancyForm.patchValue(record);
    this.records.splice(index, 1); // Remove the record so it can be replaced after editing
  }

  onDeleteRecord(index: number) {
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
  }



  onSubmit() {
    if (!this.motherId) {
      this.error = 'Mother ID is missing.';
      return;
    }

    const formValue = this.pregnancyForm.value;

    this.mothersService.addPrenatalRecord(this.motherId, formValue)
      .then((res) => {
        this.records.push({ id: res.id, ...res.data }); // Include Firestore ID
        this.pregnancyForm.reset({
          date: new Date().toISOString().split('T')[0]
        });
        this.error = null;
        this.successMessage = 'Record saved successfully!';
        setTimeout(() => this.successMessage = '', 2000);
      })
      .catch(error => {
        console.error(error);
        this.error = 'Failed to save the prenatal record.';
      });
  }



}
