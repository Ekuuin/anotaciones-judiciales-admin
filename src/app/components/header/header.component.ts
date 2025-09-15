import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  userName: string | null = '';
  userPhoto: string | null = '';
  dateAct: string = new Date().toLocaleDateString('es-MX');
  menuOpen: boolean = false;


  ngOnInit(): void {
    const dataUser = localStorage.getItem('dataUser');
    if (dataUser) {
      const user = JSON.parse(dataUser);
      this.userName = user.displayName || 'Usuario';
      this.userPhoto = user.photoURL || 'assets/img/default-user.svg';
    }
  }


  onLogout(): void {
    this.authService.signOut().subscribe({
      next: () => {
        console.log('Sesión cerrada');
        this.router.navigate(['/login']); // 🔹 Redirige al login
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
