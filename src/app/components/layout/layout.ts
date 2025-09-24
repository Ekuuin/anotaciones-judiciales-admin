import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CarouselService, CarouselSlide } from '../../services/carousel.service';

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
  carouselSlides: CarouselSlide[] = [];
  isLoadingSlides = true;
  hasSlides = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private carouselService: CarouselService
  ) {}
  ngOnInit(): void {
    const dataUser = localStorage.getItem('dataUser');
    if (dataUser) {
      const user = JSON.parse(dataUser);
      this.userName = user.displayName || 'Usuario';
      this.userPhoto = user.photoURL || './assets/img/default-user.png';
    }

    // Cargar slides desde el servidor Python
    this.obtenerSlides();
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  // Métodos del carrusel
  obtenerSlides(): void {
    this.isLoadingSlides = true;

    this.carouselService.getSlides().subscribe({
      next: (response) => {
        this.isLoadingSlides = false;

        if (response.isSuccess && response.data.length > 0) {
          this.carouselSlides = response.data;
          this.hasSlides = true;
        } else {
          this.hasSlides = response.data.length > 0;
        }

        // Iniciar carrusel solo después de cargar slides
        if (this.hasSlides) {
          this.startAutoSlide();
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar slides:', error);
        this.isLoadingSlides = false;
        this.hasSlides = false;

        // Cargar slides de emergencia
        this.loadFallbackSlides();
      },
    });
  }

  private loadFallbackSlides(): void {
    this.carouselSlides = [
      {
        imagenUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format',
        title: 'Servicios Digitales',
        description: 'Modernización en trámites del Registro Civil'
      },
      {
        imagenUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&auto=format',
        title: 'Atención Ciudadana',
        description: 'Comprometidos con la excelencia en el servicio'
      },
      {
        imagenUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&auto=format',
        title: 'Innovación',
        description: 'Tecnología al servicio de la ciudadanía'
      }
    ];
    this.hasSlides = true;
    this.startAutoSlide();
  }

  startAutoSlide(): void {
    // Limpiar intervalo existente
    this.stopAutoSlide();

    // Solo iniciar si hay slides
    if (this.carouselSlides.length > 1) {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 4000); // Cambia cada 4 segundos
    }
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide(): void {
    if (this.carouselSlides.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;
    }
  }

  previousSlide(): void {
    if (this.carouselSlides.length > 0) {
      this.currentSlide = this.currentSlide === 0
        ? this.carouselSlides.length - 1
        : this.currentSlide - 1;
    }
  }

  // Método helper para calcular el porcentaje de transform dinámicamente
  getTransformPercent(): number {
    if (this.carouselSlides.length === 0) return 0;
    return (this.currentSlide * (100 / this.carouselSlides.length));
  }

  // Método helper para calcular el ancho del contenedor
  getContainerWidth(): string {
    return `${this.carouselSlides.length * 100}%`;
  }

  // Método helper para calcular el ancho de cada slide
  getSlideWidth(): string {
    if (this.carouselSlides.length === 0) return '100%';
    return `${100 / this.carouselSlides.length}%`;
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
