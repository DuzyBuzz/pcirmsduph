import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
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
    const motherRef = doc(this.firestore, 'mothers', id); // Firestore document reference
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

  // Example: Fetch all mothers (if needed)
  // Note: To fetch a collection, use `getDocs()` instead of `getDoc()`
  getAllMothers(): Observable<any[]> {
    // Implement this if required, you can use `getDocs` for fetching a collection
    return new Observable<any[]>(); // Placeholder for example purposes
  }
}
