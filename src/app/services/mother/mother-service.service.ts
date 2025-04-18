import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, addDoc,getDocs, deleteDoc } from 'firebase/firestore';
import { environment } from '../../../environments/environment';
import { Observable, from } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class MothersService {
  private firestore;

  constructor() {
    // Initialize Firebase
    const app = initializeApp(environment.firebaseConfig);
    this.firestore = getFirestore(app);
  }

  // Fetch a mother's record by ID
  getMotherById(id: string): Observable<any> {
    const motherRef = doc(this.firestore, 'mothers', id);
    return from(
      getDoc(motherRef).then(docSnap => {
        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          throw new Error('No such document!');
        }
      })
    );
  }

  addPrenatalRecord(motherId: string, record: any): Promise<{ id: string; data: any }> {
    // Ensure the record has a proper structure and data
    const collectionRef = collection(this.firestore, `mothers/${motherId}/prenatalRecords`);

    return addDoc(collectionRef, record).then(docRef => {
      // Firestore automatically assigns an ID to each document
      return { id: docRef.id, data: { ...record, id: docRef.id } }; // Return document data with the ID
    }).catch(error => {
      console.error("Error adding record: ", error);
      throw new Error('Failed to save prenatal record.');
    });
  }
// Delete a prenatal record
deletePrenatalRecord(motherId: string, recordId: string): Promise<void> {
  const docRef = doc(this.firestore, `mothers/${motherId}/prenatalRecords/${recordId}`);
  return deleteDoc(docRef);
}

// Fetch prenatal records
getPrenatalRecords(motherId: string): Promise<{ id: string, data: any }[]> {
  const collectionRef = collection(this.firestore, `mothers/${motherId}/prenatalRecords`);
  return getDocs(collectionRef).then(snapshot =>
    snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }))
  );
}

  // Placeholder example: fetch all mothers if needed
  getAllMothers(): Observable<any[]> {
    return new Observable<any[]>(); // Implement later if needed
  }

}
