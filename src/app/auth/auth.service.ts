import { Injectable } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    // Removed routing logic from the constructor
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  // Initialize routing logic in ngOnInit() or on a more appropriate lifecycle method
  public handleAuthRedirect() {
    const user = this.userSubject.value;
    if (!user) {
      this.router.navigate(['/auth/login']);
    }
  }

  // ✅ Get Current User Observable
  getCurrentUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  // ✅ Get User ID
  async getCurrentUserId(): Promise<string | null> {
    return this.userSubject.value?.uid ?? null;
  }

  // ✅ Register with Email & Password
  async registerWithEmail(email: string, password: string, name: string): Promise<void> {
    this.loadingSubject.next(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email.trim(), password.trim());
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        await setDoc(doc(this.firestore, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          name,
          email
        });
      }
    } catch (error) {
      throw this.handleAuthError(error);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // ✅ Login with Email
  async loginWithCredentials(email: string, password: string): Promise<User> {
    this.loadingSubject.next(true);
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email.trim(), password.trim());
      return userCredential.user;
    } catch (error) {
      throw this.handleAuthError(error);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // ✅ Google Sign-In
  async googleSignIn(): Promise<User> {
    this.loadingSubject.next(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      if (result.user) {
        await setDoc(doc(this.firestore, 'users', result.user.uid), {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email
        }, { merge: true });
      }
      return result.user;
    } catch (error) {
      throw this.handleAuthError(error);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // ✅ Logout
  async logout(): Promise<void> {
    this.loadingSubject.next(true);
    try {
      await signOut(this.auth);
      this.router.navigate(['/auth/login']);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // ✅ Handle Auth Errors
  private handleAuthError(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use': return "Email is already in use.";
      case 'auth/invalid-email': return "Invalid email format.";
      case 'auth/weak-password': return "Password should be at least 6 characters.";
      case 'auth/wrong-password': return "Incorrect password.";
      default: return "Authentication failed.";
    }
  }

  // ✅ Get Admin Email from Environment
  getAdminEmail(): string {
    return environment.adminEmail;
  }

  // ✅ Get Loading State Observable
  getLoadingState(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
// ✅ Check if OB-GYNE data exists for a user
async checkObGyneData(uid: string): Promise<boolean> {
  const obGyneDocRef = doc(this.firestore, 'users', uid);  // Create reference
  const docSnap = await getDoc(obGyneDocRef);  // Retrieve the document
  return docSnap.exists();  // Return true if exists, otherwise false
}

}
