import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Solicitud {
  folio: string;
  usuario: string;
  fecha: string;
  lineaCaptura: string;
  estado: 'En revisión' | 'Aprobada' | 'Rechazada' | 'Pagada' | 'Finalizada';
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.scss',
})
export class Solicitudes {
  public headers = ['Folio', 'Usuario', 'Fecha', 'Línea de captura', 'Estado', 'Acciones'];
  public solicitudes: Solicitud[] = [
    {
      folio: '001',
      usuario: 'Juan Pérez',
      fecha: '2024-01-15',
      lineaCaptura: '542334367148',
      estado: 'Pagada',
    },
    {
      folio: '002',
      usuario: 'María López',
      fecha: '2024-01-16',
      lineaCaptura: '542334367149',
      estado: 'Aprobada',
    },
    {
      folio: '003',
      usuario: 'Carlos Sánchez',
      fecha: '2024-01-17',
      lineaCaptura: '542334367150',
      estado: 'Rechazada',
    },
    {
      folio: '004',
      usuario: 'Ana Gómez',
      fecha: '2024-01-18',
      lineaCaptura: '542334367151',
      estado: 'En revisión',
    },
    {
      folio: '005',
      usuario: 'Luis Martínez',
      fecha: '2024-01-19',
      lineaCaptura: '542334367152',
      estado: 'Aprobada',
    },
    {
      folio: '006',
      usuario: 'Sofía Ramírez',
      fecha: '2024-01-20',
      lineaCaptura: '542334367153',
      estado: 'Rechazada',
    },
    {
      folio: '007',
      usuario: 'Miguel Torres',
      fecha: '2024-01-21',
      lineaCaptura: '542334367154',
      estado: 'Pagada',
    },
    {
      folio: '008',
      usuario: 'Laura Fernández',
      fecha: '2024-01-22',
      lineaCaptura: '542334367155',
      estado: 'Aprobada',
    },
    {
      folio: '009',
      usuario: 'Diego Ruiz',
      fecha: '2024-01-23',
      lineaCaptura: '542334367156',
      estado: 'Rechazada',
    },
    {
      folio: '010',
      usuario: 'Elena Morales',
      fecha: '2024-01-24',
      lineaCaptura: '542334367157',
      estado: 'Finalizada',
    },
    {
      folio: '011',
      usuario: 'Pedro Jiménez',
      fecha: '2024-01-25',
      lineaCaptura: '542334367158',
      estado: 'Aprobada',
    },
    {
      folio: '012',
      usuario: 'Marta Castillo',
      fecha: '2024-01-26',
      lineaCaptura: '542334367159',
      estado: 'En revisión',
    },
    {
      folio: '013',
      usuario: 'Javier Ruiz',
      fecha: '2024-01-27',
      lineaCaptura: '542334367160',
      estado: 'Finalizada',
    },
    {
      folio: '014',
      usuario: 'Carmen Díaz',
      fecha: '2024-01-28',
      lineaCaptura: '542334367161',
      estado: 'En revisión',
    },
    {
      folio: '015',
      usuario: 'Andrés Herrera',
      fecha: '2024-01-29',
      lineaCaptura: '542334367162',
      estado: 'Rechazada',
    },
    {
      folio: '016',
      usuario: 'Lucía Vázquez',
      fecha: '2024-01-30',
      lineaCaptura: '542334367163',
      estado: 'Pagada',
    },
    {
      folio: '017',
      usuario: 'Fernando Silva',
      fecha: '2024-01-31',
      lineaCaptura: '542334367164',
      estado: 'Aprobada',
    },
    {
      folio: '018',
      usuario: 'Isabel Moreno',
      fecha: '2024-02-01',
      lineaCaptura: '542334367165',
      estado: 'Rechazada',
    },
    {
      folio: '019',
      usuario: 'Raúl Ortiz',
      fecha: '2024-02-02',
      lineaCaptura: '542334367166',
      estado: 'Pagada',
    },
  ];

  // Array filtrado (cambia según la búsqueda)
  public filteredSolicitudes = [...this.solicitudes];
  // Array paginado (lo que se muestra en la tabla)
  public paginatedSolicitudes: any[] = [];

  public currentPage = 1;
  public itemsPerPage = 11;
  public totalItems = this.solicitudes.length;
  public totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

  constructor(private router: Router) {
    this.updatePaginatedSolicitudes();
  }

  public updatePaginatedSolicitudes(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedSolicitudes = this.filteredSolicitudes.slice(start, end);
  }

  public goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedSolicitudes();
  }

  public nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  public previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  public getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  public onSearchEvent(searchTerm: string): void {
    const term = searchTerm.toLowerCase().trim();

    if (term === '') {
      // Si no hay término de búsqueda, mostrar todas las solicitudes
      this.filteredSolicitudes = [...this.solicitudes];
    } else {
      // Filtrar las solicitudes según el término de búsqueda
      this.filteredSolicitudes = this.solicitudes.filter(
        (solicitud) =>
          solicitud.folio.toLowerCase().includes(term) ||
          solicitud.usuario.toLowerCase().includes(term) ||
          solicitud.fecha.toLowerCase().includes(term) ||
          solicitud.estado.toLowerCase().includes(term)
      );
    }

    // Actualizar contadores y paginación basándose en los resultados filtrados
    this.totalItems = this.filteredSolicitudes.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1; // Volver a la primera página
    this.updatePaginatedSolicitudes();
  }

  public cancelarSolicitud(folio: string): void {
    this.filteredSolicitudes = this.filteredSolicitudes.map((solicitud) => {
      if (solicitud.folio === folio) {
        return { ...solicitud, estado: 'Rechazada' };
      }
      return solicitud;
    });
    this.updatePaginatedSolicitudes();
  }

  public verDetalles(folio: string): void {
    this.router.navigate(['/solicitudes/' + folio]);
  }

  public verificarPago(lineaCaptura: string, folio: string): void {
    alert('Verificando pago para la línea de captura: ' + lineaCaptura);
    this.filteredSolicitudes = this.filteredSolicitudes.map((solicitud) => {
      if (solicitud.folio === folio) {
        return { ...solicitud, estado: 'Pagada' };
      }
      return solicitud;
    });
    this.updatePaginatedSolicitudes();
  }

  public subirDocumento(folio: string): void {
    alert('Subir documento para la solicitud con folio: ' + folio);
    this.filteredSolicitudes = this.filteredSolicitudes.map((solicitud) => {
      if (solicitud.folio === folio) {
        return { ...solicitud, estado: 'Finalizada' };
      }
      return solicitud;
    });
    this.updatePaginatedSolicitudes();
  }
}
