import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Child } from '../../models/child.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-children',
  standalone: false,
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss'],
})
export class ChildrenComponent implements OnInit {
  children$: Observable<Child[]>;
  childForm: Child = {
    userId: '',
    childName: '',
    motherName: '',
    motherEducation: '',
    motherOccupation: '',
    fatherName: '',
    fatherEducation: '',
    fatherOccupation: '',
    noOfPregnancies: 0,
    birthDate: '',
    gestationalAge: '',
    birthType: 'Normal',
    birthOrder: 1,
    birthWeight: '',
    birthLength: '',
    placeOfDelivery: 'Hospital',
    dateOfBirthRegistration: '',
    birthAttendant: 'Doctor',
    gender: '',
    newbornScreening: false,
    bcg: false,
    dpt: false,
    opv: false,
    hepatitisB: false,
    measles: false,
    vitaminA: false,
    counseling: false,
    growthMonitoring: false,
    developmentalScreening: false,
    deworming: false,
    dentalCheckup: false,
    lu100000: false,
    lu200000: false
  };
  isModalOpen = false;

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.children$ = this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          const userId = user.uid;
          const childrenRef = collection(this.firestore, 'children');
          
          // Query the children collection filtered by the userId
          const childrenQuery = query(childrenRef, where("userId", "==", userId));
          
          // Map Firestore data to Child interface
          return collectionData(childrenQuery, { idField: 'id' }).pipe(
            map((childrenData) => 
              childrenData.map((child: any) => this.mapToChild(child))
            )
          );
        }
        return []; // Return an empty array if no user is logged in
      })
    );
  }

  ngOnInit(): void {}
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  // Map Firestore data to the Child interface
  private mapToChild(child: any): Child {
    return {
      ...child,
      id: child.id, // Ensure that the id field is included
      userId: child.userId || '',  // Add default values in case they are missing
      childName: child.childName || '',
      motherName: child.motherName || '',
      motherEducation: child.motherEducation || '',
      motherOccupation: child.motherOccupation || '',
      fatherName: child.fatherName || '',
      fatherEducation: child.fatherEducation || '',
      fatherOccupation: child.fatherOccupation || '',
      noOfPregnancies: child.noOfPregnancies || 0,
      birthDate: child.birthDate || '',
      gestationalAge: child.gestationalAge || '',
      birthType: child.birthType || 'Normal',
      birthOrder: child.birthOrder || 1,
      birthWeight: child.birthWeight || '',
      birthLength: child.birthLength || '',
      placeOfDelivery: child.placeOfDelivery || 'Hospital',
      dateOfBirthRegistration: child.dateOfBirthRegistration || '',
      birthAttendant: child.birthAttendant || 'Doctor',
      gender: child.gender || '',
      newbornScreening: child.newbornScreening || false,
      bcg: child.bcg || false,
      dpt: child.dpt || false,
      opv: child.opv || false,
      hepatitisB: child.hepatitisB || false,
      measles: child.measles || false,
      vitaminA: child.vitaminA || false,
      counseling: child.counseling || false,
      growthMonitoring: child.growthMonitoring || false,
      developmentalScreening: child.developmentalScreening || false,
      deworming: child.deworming || false,
      dentalCheckup: child.dentalCheckup || false,
      lu100000: child.lu100000 || false,
      lu200000: child.lu200000 || false,
      medicalNotes: child.medicalNotes || '',
      guardianName: child.guardianName || '',
      guardianContact: child.guardianContact || ''
    };
  }

  async saveChild(): Promise<void> {
    const user = await this.authService.getCurrentUser().toPromise();
    if (user) {
      const userId = user.uid;
      const childrenRef = collection(this.firestore, 'children');
      this.childForm.userId = userId;
  
      if (this.childForm.id) {
        const childDocRef = doc(this.firestore, `children/${this.childForm.id}`);
        const sanitizedData = this.sanitizeChildData(this.childForm);
        await updateDoc(childDocRef, sanitizedData);
      } else {
        await addDoc(childrenRef, this.childForm);
      }
      this.resetForm();
    }
  }
  

  deleteChild(id: string) {
    if (id) {
      const childDocRef = doc(this.firestore, `children/${this.childForm.id}`);

      deleteDoc(childDocRef);
    }
  }
  

  // Set the form for editing
  editChild(child: Child): void {
    this.childForm = { ...child };
  }

  // Reset the form
  resetForm(): void {
    this.childForm = {
      userId: '',
      childName: '',
      motherName: '',
      motherEducation: '',
      motherOccupation: '',
      fatherName: '',
      fatherEducation: '',
      fatherOccupation: '',
      noOfPregnancies: 0,
      birthDate: '',
      gestationalAge: '',
      birthType: 'Normal',
      birthOrder: 1,
      birthWeight: '',
      birthLength: '',
      placeOfDelivery: 'Hospital',
      dateOfBirthRegistration: '',
      birthAttendant: 'Doctor',
      gender: '',
      newbornScreening: false,
      bcg: false,
      dpt: false,
      opv: false,
      hepatitisB: false,
      measles: false,
      vitaminA: false,
      counseling: false,
      growthMonitoring: false,
      developmentalScreening: false,
      deworming: false,
      dentalCheckup: false,
      lu100000: false,
      lu200000: false
    };
  }

  // Sanitize child data before saving or updating
  private sanitizeChildData(child: Child): { [key: string]: any } {
    return {
      id: child.id ?? null,
      userId: child.userId ?? null,
      childName: child.childName ?? null,
      motherName: child.motherName ?? null,
      motherEducation: child.motherEducation ?? null,
      motherOccupation: child.motherOccupation ?? null,
      fatherName: child.fatherName ?? null,
      fatherEducation: child.fatherEducation ?? null,
      fatherOccupation: child.fatherOccupation ?? null,
      noOfPregnancies: child.noOfPregnancies ?? 0,
      birthDate: child.birthDate ?? null,
      gestationalAge: child.gestationalAge ?? null,
      birthType: child.birthType ?? 'Normal',
      birthOrder: child.birthOrder ?? 1,
      birthWeight: child.birthWeight ?? null,
      birthLength: child.birthLength ?? null,
      placeOfDelivery: child.placeOfDelivery ?? 'Hospital',
      dateOfBirthRegistration: child.dateOfBirthRegistration ?? null,
      birthAttendant: child.birthAttendant ?? 'Doctor',
      gender: child.gender ?? null,
      newbornScreening: child.newbornScreening ?? false,
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
      medicalNotes: child.medicalNotes ?? null,
      guardianName: child.guardianName ?? null,
      guardianContact: child.guardianContact ?? null,
    };
  }
}