import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalles',
  imports: [CommonModule],
  templateUrl: './detalles.html',
  styleUrls: ['./detalles.scss']
})
export class Detalles {
  public solicitud: { estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'En revisión' } = { estado: 'Pendiente' };

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/solicitudes']);
  }
}
