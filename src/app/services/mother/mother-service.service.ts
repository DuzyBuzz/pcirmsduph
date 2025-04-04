import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotherServiceService {
  constructor(private firestore: AngularFirestore) {}

  getMotherById(motherId: string): Observable<any> {
    return this.firestore.collection('mothers').doc(motherId).valueChanges();
  }

  // 🔽 ADD THIS METHOD
  getPregnancyRecords(motherId: string): Observable<any[]> {
    return this.firestore
      .collection(`mothers/${motherId}/pregnancyRecords`, ref => ref.orderBy('date', 'desc'))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as { [key: string]: any };

            const id = a.payload.doc.id;

            return { id, ...data };

          })
        )
      );
  }
}
