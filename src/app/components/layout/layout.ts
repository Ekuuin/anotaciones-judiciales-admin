import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface CarouselSlide {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit, OnDestroy {
  userName: string | null = ''; 
  userPhoto: string | null = '';

  // Propiedades del carrusel
  currentSlide = 0;
  private autoSlideInterval: any;
  carouselSlides: CarouselSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format',
      title: 'Servicios Digitales',
      description: 'Modernización en trámites del Registro Civil'
    },
    {
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&auto=format',
      title: 'Atención Ciudadana',
      description: 'Comprometidos con la excelencia en el servicio'
    },
    {
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&auto=format',
      title: 'Innovación',
      description: 'Tecnología al servicio de la ciudadanía'
    }
  ];

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    const dataUser = localStorage.getItem('dataUser');
    if (dataUser) {
      const user = JSON.parse(dataUser);
      this.userName = user.displayName || 'Usuario';
      this.userPhoto = user.photoURL || './assets/img/default-user.png';
    }
    
    // Iniciar carrusel automático
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  // Métodos del carrusel
  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Cambia cada 4 segundos
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;
  }

  previousSlide(): void {
    this.currentSlide = this.currentSlide === 0 
      ? this.carouselSlides.length - 1 
      : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    // Reiniciar el auto-slide cuando el usuario navega manualmente
    this.stopAutoSlide();
    this.startAutoSlide();
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
