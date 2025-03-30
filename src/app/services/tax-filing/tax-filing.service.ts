import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  collectionData,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TaxFiling } from '../../models/tax-filing.model';

@Injectable({
  providedIn: 'root',
})
export class TaxFilingService {
  private readonly firestore = inject(Firestore);

  /** ✅ Get User-Specific Tax Filings in Real-Time */
  getUserTaxFilings(userId: string): Observable<TaxFiling[]> {
    const taxCollection = collection(this.firestore, 'taxFilings');
    const q = query(taxCollection, where('userId', '==', userId));

    return new Observable<TaxFiling[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const taxFilings: TaxFiling[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as TaxFiling;
          taxFilings.push({ ...data, id: doc.id });
        });
        observer.next(taxFilings); // Emit the updated tax filings
      });

      // Return a cleanup function to stop listening when unsubscribed
      return () => unsubscribe();
    });
  }

  /** ✅ Add a Tax Filing */
  async addTaxFiling(data: Omit<TaxFiling, 'id' | 'userId'>, userId: string): Promise<void> {
    const taxCollection = collection(this.firestore, 'taxFilings');
    await addDoc(taxCollection, { ...data, userId });
  }

  /** ✅ Update an Existing Tax Filing */
  async updateTaxFiling(id: string, data: Partial<TaxFiling>): Promise<void> {
    const taxDoc = doc(this.firestore, 'taxFilings', id);
    await updateDoc(taxDoc, data);
  }

  /** ✅ Delete a Tax Filing */
  async deleteTaxFiling(id: string): Promise<void> {
    const taxDoc = doc(this.firestore, 'taxFilings', id);
    await deleteDoc(taxDoc);
  }
}
