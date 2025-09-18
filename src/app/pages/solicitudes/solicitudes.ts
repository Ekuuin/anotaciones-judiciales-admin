import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.scss',
})
export class Solicitudes {
  public headers = ['Folio', 'Usuario', 'Fecha', 'Estado', 'Acciones'];
  public solicitudes = [
    { folio: '001', usuario: 'Juan Pérez', fecha: '2024-01-15', estado: 'Pendiente' },
    { folio: '002', usuario: 'María López', fecha: '2024-01-16', estado: 'Aprobada' },
    { folio: '003', usuario: 'Carlos Sánchez', fecha: '2024-01-17', estado: 'Rechazada' },
    { folio: '004', usuario: 'Ana Gómez', fecha: '2024-01-18', estado: 'Pendiente' },
    { folio: '005', usuario: 'Luis Martínez', fecha: '2024-01-19', estado: 'Aprobada' },
    { folio: '006', usuario: 'Sofía Ramírez', fecha: '2024-01-20', estado: 'Rechazada' },
    { folio: '007', usuario: 'Miguel Torres', fecha: '2024-01-21', estado: 'Pendiente' },
  ];

  // Array filtrado (cambia según la búsqueda)
  public filteredSolicitudes = [...this.solicitudes];
  // Array paginado (lo que se muestra en la tabla)
  public paginatedSolicitudes: any[] = [];

  public currentPage = 1;
  public itemsPerPage = 10;
  public totalItems = this.solicitudes.length;
  public totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

  constructor() {
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
      this.filteredSolicitudes = this.solicitudes.filter(solicitud =>
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
    this.filteredSolicitudes = this.filteredSolicitudes.map(solicitud => {
      if (solicitud.folio === folio && solicitud.estado === 'Pendiente') {
        return { ...solicitud, estado: 'Rechazada' };
      }
      return solicitud;
    });
    this.updatePaginatedSolicitudes();
  }
}
