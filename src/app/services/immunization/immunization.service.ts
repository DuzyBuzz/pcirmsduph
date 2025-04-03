import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';  // Firestore service
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';  // Import switchMap from rxjs/operators
import { Child } from '../../models/child.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ImmunizationService {
  private collectionName = 'children'; // Firebase collection name

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  // Add a new child
  addChild(child: Partial<Child>): Observable<void> {
    return this.authService.getCurrentUser().pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not logged in');
        }

        // Ensure that all necessary properties are included, and set sensible defaults
        const newChild: Child = {
          userId: user.uid, // Attach the user ID to the child (parent-child relationship)
          childNo: child.childNo || '', // Default to an empty string if not provided
          familyNo: child.familyNo || '', // Default to an empty string if not provided
          completeAddress: child.completeAddress || '',
          childName: child.childName || '', // Ensure non-null value
          motherName: child.motherName || '', // Ensure non-null value
          motherEducation: child.motherEducation || '', // Ensure non-null value
          motherOccupation: child.motherOccupation || '', // Ensure non-null value
          fatherName: child.fatherName || '', // Ensure non-null value
          fatherEducation: child.fatherEducation || '', // Ensure non-null value
          fatherOccupation: child.fatherOccupation || '', // Ensure non-null value
          noOfPregnancies: child.noOfPregnancies || 0,
          birthDate: child.birthDate || '', // Ensure non-null value
          gestationalAge: child.gestationalAge || '', // Ensure non-null value
          birthType: child.birthType || 'Normal', // Default to 'Normal' if not provided
          birthOrder: child.birthOrder || 1, // Default to 1 if not provided
          birthWeight: child.birthWeight || '0', // Default to '0' if not provided
          birthLength: child.birthLength || '0', // Default to '0' if not provided
          placeOfDelivery: child.placeOfDelivery || 'Hospital', // Default to 'Hospital' if not provided
          dateOfBirthRegistration: child.dateOfBirthRegistration || '', // Ensure non-null value
          birthAttendant: child.birthAttendant || 'Doctor', // Default to 'Doctor' if not provided
          newbornScreening: child.newbornScreening ?? false, // Default to false
          bcg: child.bcg ?? false,
          dpt: child.dpt ?? false,
          opv: child.opv ?? false,
          hepatitisB: child.hepatitisB ?? false,
          measles: child.measles ?? false,
          vitaminA: child.vitaminA ?? false,
          counseling: child.counseling ?? false,
          growthMonitoring: child.growthMonitoring ?? false,
          developmentalScreening: child.developmentalScreening ?? false,
          deworming: child.deworming ?? false,
          dentalCheckup: child.dentalCheckup ?? false,
          lu100000: child.lu100000 ?? false,
          lu200000: child.lu200000 ?? false,
          medicalNotes: child.medicalNotes || '',
          gender: ''
        };

        return this.firestore.collection<Child>(this.collectionName)
          .add(newChild)
          .then(() => {})
          .catch((error) => {
            console.error("Error adding child: ", error);
            throw new Error("Error adding child to Firestore");
          });
      })
    );
  }

  // Update a child
  updateChild(childId: string, child: Partial<Child>): Observable<void> {
    return this.authService.getCurrentUser().pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not logged in');
        }

        const updatedChild: Partial<Child> = {
          userId: user.uid,  // Update the userId if necessary (e.g., in case the user changes)
          ...child,  // Spread the other fields into the updated child object
        };

        return this.firestore.collection<Child>(this.collectionName).doc(childId)
          .update(updatedChild)
          .then(() => {})
          .catch((error) => {
            console.error("Error updating child: ", error);
            throw new Error("Error updating child in Firestore");
          });
      })
    );
  }

  // Get a list of children for the logged-in user
  getChildren(): Observable<Child[]> {
    return this.authService.getCurrentUser().pipe(
      switchMap((user) => {
        if (!user) {
          return [];  // Return an empty array if no user is logged in
        }
        return this.firestore.collection<Child>(this.collectionName, ref =>
          ref.where('userId', '==', user.uid)  // Filter children by the logged-in user's ID
        ).valueChanges();
      })
    );
  }
  // Inside ImmunizationService
deleteChild(id: string): Promise<void> {
  return this.firestore.collection<Child>(this.collectionName).doc(id).delete()
    .then(() => {})
    .catch((error) => {
      console.error('Error deleting child:', error);
      throw new Error('Error deleting child from Firestore');
    });
}
  
}
