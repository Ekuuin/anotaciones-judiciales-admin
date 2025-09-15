// auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    // 🔹 Inicializamos desde localStorage si existe
    const storedUser = localStorage.getItem('dataUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.user$ = this.currentUserSubject.asObservable();

    // 🔹 Mantener sincronizado con Firebase
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
      if (user) localStorage.setItem('dataUser', JSON.stringify(user));
      else localStorage.removeItem('dataUser');
    });
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Login con Google
  onGoogleLogin(): Observable<User | null> {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    return from(
      signInWithPopup(this.auth, provider)
        .then(result => result.user)
        .catch(error => {
          console.error('Google login error:', error.code, error.message);
          return null;
        })
    );
  }

  // Logout
  signOut(): Observable<void> {
    return from(this.auth.signOut());
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
