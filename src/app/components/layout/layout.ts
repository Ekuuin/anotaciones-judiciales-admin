import { Component, OnInit } from '@angular/core';
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
export class Layout implements OnInit{
  userName: string | null = ''; 
  userPhoto: string | null = '';

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    const dataUser = localStorage.getItem('dataUser');
    if (dataUser) {
      const user = JSON.parse(dataUser);
      this.userName = user.displayName || 'Usuario';
      this.userPhoto = user.photoURL || './assets/img/default-user.png';
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
      },
    });
  }
}
