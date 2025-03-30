import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaxFilingService } from '../../services/tax-filing/tax-filing.service';
import { TaxFiling } from '../../models/tax-filing.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-tax-filing',
  standalone: false,
  templateUrl: './tax-filing.component.html',
  styleUrls: ['./tax-filing.component.scss'],
})
export class TaxFilingComponent implements OnInit {
  taxFilings$!: Observable<TaxFiling[]>;
  newTax: Partial<TaxFiling> = this.getEmptyTaxFiling();
  isEditMode = false;
  editingTaxId: string | null = null;
  showModal = false;
  userId: string | null = null;

  constructor(
    private taxService: TaxFilingService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    try {
      this.userId = await this.authService.getCurrentUserId();
      if (this.userId) {
        this.taxFilings$ = this.taxService.getUserTaxFilings(this.userId);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
      alert('Failed to retrieve user data. Please refresh and try again.');
    }
  }

  /** ✅ Get an empty tax filing object */
  private getEmptyTaxFiling(): Partial<TaxFiling> {
    return {
      taxYear: new Date().getFullYear(),
      businessType: '',
      amount: 0,
      businessName: '',
      businessAddress: '',
      contactNumber: '',
      permitNo: '',
      status: 'pending',
    };
  }

/** ✅ Save or update tax filing */
async saveTaxFiling() {
  if (!this.newTax.taxYear || !this.newTax.businessType || !this.newTax.amount) {
    alert('Please fill in all required fields.');
    return;
  }

  if (!this.userId) {
    alert('User not authenticated.');
    return;
  }

  try {
    const taxData: Omit<TaxFiling, 'id' | 'userId' | 'createdAt'> = {
      taxYear: Number(this.newTax.taxYear),
      businessType: this.newTax.businessType.trim(),
      amount: Number(this.newTax.amount),
      businessName: this.newTax.businessName?.trim() || '',
      businessAddress: this.newTax.businessAddress?.trim() || '',
      contactNumber: this.newTax.contactNumber?.trim() || '',
      permitNo: this.newTax.permitNo?.trim() || '',
      status: this.newTax.status || 'pending',
    };

    if (this.isEditMode && this.editingTaxId) {
      // Update tax filing
      await this.taxService.updateTaxFiling(this.editingTaxId, taxData);
    } else {
      // Add new tax filing
      await this.taxService.addTaxFiling(taxData, this.userId);
    }

    this.closeModal();
  } catch (error) {
    console.error('Error saving tax filing:', error);
    alert('Failed to save tax filing. Please try again.');
  }
}


  /** ✅ Open edit modal */
  openEditModal(tax: TaxFiling) {
    this.newTax = { ...tax };
    this.isEditMode = true;
    this.editingTaxId = tax.id!;
    this.showModal = true;
  }

  /** ✅ Open add modal */
  openAddModal() {
    this.newTax = this.getEmptyTaxFiling();
    this.isEditMode = false;
    this.editingTaxId = null;
    this.showModal = true;
  }

  /** ✅ Close modal */
  closeModal() {
    this.showModal = false;
    this.newTax = this.getEmptyTaxFiling();
    this.isEditMode = false;
    this.editingTaxId = null; // Ensure edit mode is reset
  }

  /** ✅ Delete tax filing */
  async deleteTaxFiling(id: string) {
    if (!this.userId) {
      alert('User not authenticated.');
      return;
    }

    if (confirm('Are you sure you want to delete this tax filing?')) {
      try {
        await this.taxService.deleteTaxFiling(id);
      } catch (error) {
        console.error('Error deleting tax filing:', error);
        alert('Failed to delete tax filing. Please try again.');
      }
    }
  }
}
