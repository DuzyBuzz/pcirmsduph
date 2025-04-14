import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Child } from '../../models/child.model';
import { AuthService } from '../../auth/auth.service';
import { Route, Router } from '@angular/router';

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
    lu200000: false,
    medicalNotes: '',
    guardianName: '',
    guardianContact: '',
  };
  isModalOpen = false;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router
  ) {
    this.children$ = this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          const userId = user.uid;
          const childrenRef = collection(this.firestore, 'children');

          const childrenQuery = query(childrenRef, where("userId", "==", userId));

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

  private mapToChild(child: any): Child {
    return {
      ...child,
      id: child.id,
      userId: child.userId || '',
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
      guardianContact: child.guardianContact || '',
    };
  }
  navigateToChildForm() {
    this.router.navigate(['/ob-gyne/child-form']);
  }
  saveChild() {
    const currentUser = this.authService.getCurrentUser();
    currentUser.subscribe(user => {
      if (user) {
        const childrenRef = collection(this.firestore, 'children');

        if (this.childForm.id) {
          // If the child has an ID, we update the existing document
          const childRef = doc(this.firestore, `children/${this.childForm.id}`);
          updateDoc(childRef, { ...this.childForm } as any); // Cast to `any` to match Firestore expected type
        } else {
          // Otherwise, we add a new child
          addDoc(childrenRef, {
            ...this.childForm,
            userId: user.uid,
          } as any); // Cast to `any` to match Firestore expected type
        }
      }
    });
    this.closeModal();
  }

  editChild(child: Child) {
    this.childForm = { ...child };
    this.openModal();
  }

  deleteChild(childId: string) {
    if (childId) {
      const childRef = doc(this.firestore, `children/${childId}`);
      deleteDoc(childRef);
    }
  }
}
