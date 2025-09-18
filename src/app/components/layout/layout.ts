import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  constructor(private authService: AuthService, private router: Router) {}

  onLogout(): void {
    this.authService.signOut().subscribe({
      next: () => {
        console.log('Sesión cerrada');
        this.router.navigate(['/login']); // 🔹 Redirige al login
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
      },
    });
  }
}
