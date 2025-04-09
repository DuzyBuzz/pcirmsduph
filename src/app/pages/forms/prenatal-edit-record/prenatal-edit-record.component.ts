import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prenatal-edit-record',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './prenatal-edit-record.component.html',
  styleUrl: './prenatal-edit-record.component.scss'
})
export class PrenatalEditRecordComponent implements OnInit {
  @Input() recordId!: string;
  @Input() motherId!: string | null;

  formData: any = {};
  originalData: any = {};
  changedFields: { key: string; label: string; oldValue: any; newValue: any }[] = [];

  showConfirmation = false;
  constructor(
    private firestore: Firestore
  ){

  }
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

  ngOnInit(): void {
    if (this.motherId && this.recordId) {
      const recordRef = doc(this.firestore, 'mothers', this.motherId, 'prenatalRecords', this.recordId);
      getDoc(recordRef).then(snapshot => {
        if (snapshot.exists()) {
          this.formData = { ...snapshot.data() };
          this.originalData = { ...snapshot.data() };
        } else {
          console.warn('No record found for ID:', this.recordId);
        }
      }).catch(error => {
        console.error('Error loading record:', error);
      });
    }
  }

  onCancel(): void {
    this.showConfirmation = false;
  }

  onSave(): void {
    this.changedFields = [];

    for (const field of this.columns) {
      const key = field.key;
      const original = this.originalData[key];
      const current = this.formData[key];

      if (original !== current) {
        this.changedFields.push({
          key,
          label: field.label,
          oldValue: original || '—',
          newValue: current || '—'
        });
      }
    }

    if (this.changedFields.length === 0) {
      alert('No changes detected.');
      return;
    }

    this.showConfirmation = true;
  }

  confirmSave(): void {
    if (this.motherId && this.recordId) {
      const recordRef = doc(this.firestore, 'mothers', this.motherId, 'prenatalRecords', this.recordId);
      setDoc(recordRef, this.formData, { merge: true }).then(() => {
        this.showConfirmation = false;
        console.log('Record successfully updated');
      }).catch(error => {
        console.error('Error saving record:', error);
      });
    }
  }
}
