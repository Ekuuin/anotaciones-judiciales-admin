import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { SERVER_CONFIG, buildApiUrl } from '../config/server.config';

export interface CarouselSlide {
  imagenUrl: string;
  title: string;
  description: string;
}

export interface SlidesResponse {
  data: CarouselSlide[];
  isSuccess: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los slides del carrusel desde el servidor Python
   * @returns Observable con los slides
   */
  getSlides(): Observable<SlidesResponse> {
    const headers = new HttpHeaders(SERVER_CONFIG.DEFAULT_HEADERS);
    const slidesUrl = buildApiUrl(SERVER_CONFIG.ENDPOINTS.SLIDES);

    console.log('🌐 Haciendo petición a:', slidesUrl);

    return this.http.get<SlidesResponse>(slidesUrl, { headers })
      .pipe(
        timeout(SERVER_CONFIG.TIMEOUT),
        catchError(this.handleError<SlidesResponse>('getSlides', {
          data: this.getFallbackSlides(),
          isSuccess: false,
          message: 'Error al conectar con el servidor Python'
        }))
      );
  }

  /**
   * Slides de respaldo en caso de error
   */
  private getFallbackSlides(): CarouselSlide[] {
    return [
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
  }

  /**
   * Maneja errores HTTP
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
