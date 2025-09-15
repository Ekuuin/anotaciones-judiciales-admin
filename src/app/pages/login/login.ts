import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '@components/header/header.component';
import { FooterComponent } from '@components/footer/footer.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onGoogleLogin(): void {
    this.authService.onGoogleLogin().subscribe({
      next: (user) => {
        if (user) {
          console.log('Login exitoso:', user);

          // 🔹 Guardamos solo lo necesario en localStorage
          const dataUser = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL // este es el bueno, directo de Firebase
          };

          localStorage.setItem('dataUser', JSON.stringify(dataUser));

          this.router.navigate(['/home']);
        } else {
          console.log('Login fallido');
        }
      },
      error: (error) => console.error('Login error:', error)
    });
  }

}
