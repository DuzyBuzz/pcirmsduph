export interface TaxFiling {
  id?: string;
  userId: string;
  taxYear: number;
  businessType: string;
  amount: number;
  businessName?: string;
  businessAddress?: string;
  contactNumber?: string;
  permitNo?: string;
  createdAt?: string;
  status: string;
}
