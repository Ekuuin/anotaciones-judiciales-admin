import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from '../../components/dialog/dialog';

interface Solicitud {
  folio: string;
  usuario: string;
  fecha: string;
  lineaCaptura: string;
  estado: 'En revisión' | 'Procedente' | 'Improcedente' | 'Pagada' | 'Escaneo Oficialía' | 'Escaneo Archivo' | 'Finalizada';
}

interface SelectedFile {
  fieldName: string;
  name: string;
  size: number;
  file: File;
}

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule, Dialog, ReactiveFormsModule],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.scss',
})
export class Solicitudes {
  // Propiedades del dialog
  showDialog = false;
  dialogTitle = '';
  dialogMessage = '';
  dialogType:
    | 'info'
    | 'success'
    | 'danger'
    | 'warning'
    | 'entregaAnotacion'
    | 'escaneoOficialia'
    | 'escaneoArchivo' = 'info';
  dialogConfirmText = 'Aceptar';
  dialogCancelText = 'Cancelar';
  dialogShowCancel = true;
  dialogCallback: (() => void) | null = null;

  // Formulario de documentos
  documentos!: FormGroup;
  selectedFiles: SelectedFile[] = [];
  maxFileSize = 5 * 1024 * 1024; // 5MB en bytes

  // Formulario de motivos de improcedencia
  motivosImprocedencia!: FormGroup;
  motivoSeleccionado = '';
  folioActual = ''; // Para almacenar el folio de la solicitud siendo procesada

  //Formulario de entrega de anotaciones
  formAnotacion!: FormGroup;

  // Formularios de escaneo
  formEscaneoOficialia!: FormGroup;
  formEscaneoArchivo!: FormGroup;

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
      estado: 'Procedente',
    },
    {
      folio: '003',
      usuario: 'Carlos Sánchez',
      fecha: '2024-01-17',
      lineaCaptura: '542334367150',
      estado: 'Improcedente',
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
      estado: 'Procedente',
    },
    {
      folio: '006',
      usuario: 'Sofía Ramírez',
      fecha: '2024-01-20',
      lineaCaptura: '542334367153',
      estado: 'Improcedente',
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
      estado: 'Procedente',
    },
    {
      folio: '009',
      usuario: 'Diego Ruiz',
      fecha: '2024-01-23',
      lineaCaptura: '542334367156',
      estado: 'Improcedente',
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
      estado: 'Procedente',
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
      estado: 'Improcedente',
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
      estado: 'Procedente',
    },
    {
      folio: '018',
      usuario: 'Isabel Moreno',
      fecha: '2024-02-01',
      lineaCaptura: '542334367165',
      estado: 'Improcedente',
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

  constructor(private router: Router, private fb: FormBuilder) {
    this.updatePaginatedSolicitudes();
    this.initializeForm();
  }

  private initializeForm(): void {
    // ✅ SOLUCIÓN: Los FormControls guardan booleanos (true/false)
    // Inicializamos en null y validamos que sean required
    // null = sin archivo, true = con archivo
    this.documentos = this.fb.group({
      actaMatrimonio: [null, Validators.required],      // null o true
      actasNacimiento: [null, Validators.required],     // null o true
      acuseNotificacion: [null, Validators.required],   // null o true
      resolucionCumplimentar: [null, Validators.required], // null o true
      autoEjecutoria: [null, Validators.required],      // null o true
    });

    this.motivosImprocedencia = this.fb.group({
      motivoPrincipal: ['', Validators.required],
      submotivo: [''],
      otroMotivo: [''],
    });

    this.formAnotacion = this.fb.group({
      anotacion: [null, Validators.required],
    });

    this.formEscaneoOficialia = this.fb.group({
      escaneoOficialia: [null, Validators.required],
    });

    this.formEscaneoArchivo = this.fb.group({
      escaneoArchivo: [null, Validators.required],
    });
  }

  // Manejo de archivos
  onFileSelected(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);

      // Validar tamaño de archivos
      const oversizedFiles = files.filter((file) => file.size > this.maxFileSize);
      if (oversizedFiles.length > 0) {
        alert(
          `Los siguientes archivos exceden el tamaño máximo de 5MB: ${oversizedFiles
            .map((f) => f.name)
            .join(', ')}`
        );
        input.value = ''; // Limpiar el input
        return;
      }

      // Remover archivos previos del mismo campo
      this.selectedFiles = this.selectedFiles.filter((f) => f.fieldName !== fieldName);

      // Agregar nuevos archivos al array
      files.forEach((file) => {
        this.selectedFiles.push({
          fieldName: this.getFieldLabel(fieldName),
          name: file.name,
          size: file.size,
          file: file,
        });
      });

      // ✅ SOLUCIÓN: Marcar el FormControl como "tiene archivo" (true)
      // En lugar de guardar el archivo, guardamos un booleano
      // Esto permite que Angular valide sin intentar modificar el input HTML
      this.documentos.patchValue({
        [fieldName]: true,  // ← Solo guardamos true/false, no el archivo
      });

      // Marcar el control como "touched" para activar validación visual
      this.documentos.get(fieldName)?.markAsTouched();
    }
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      actaMatrimonio: 'Acta de matrimonio',
      actasNacimiento: 'Actas de nacimiento',
      acuseNotificacion: 'Acuse de notificación',
      resolucionCumplimentar: 'Resolución a cumplimentar',
      autoEjecutoria: 'Auto que la declara ejecutoria',
    };
    return labels[fieldName] || fieldName;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  subirDocumentos(): void {
    // ✅ VALIDACIÓN MEJORADA:
    // Verificamos que el form sea válido (todos los campos tienen true)
    if (this.documentos.valid && this.selectedFiles.length >= 5) {
      console.log('📤 Subiendo documentos:', this.selectedFiles);

      // Aquí iría la lógica para subir los archivos al servidor
      // Usamos los archivos del array selectedFiles, NO del FormControl
      const formData = new FormData();
      this.selectedFiles.forEach((item) => {
        // Los archivos reales están en item.file
        formData.append(item.fieldName, item.file);
      });

      // Actualizar el estado de la solicitud
      this.filteredSolicitudes = this.filteredSolicitudes.map((solicitud) => {
        if (solicitud.folio === this.folioActual) {
          return { ...solicitud, estado: 'Procedente' };
        }
        return solicitud;
      });

      this.updatePaginatedSolicitudes();

      // Simular carga exitosa
      alert('✅ Documentos cargados correctamente');

      // Limpiar formulario y archivos
      this.documentos.reset();
      this.selectedFiles = [];
      this.closeDialog();
    } else {
      alert('⚠️ Por favor, selecciona todos los documentos requeridos');
    }
  }

  // Métodos para motivos de improcedencia
  onMotivoChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.motivoSeleccionado = select.value;

    // Resetear campos relacionados cuando cambia el motivo principal
    this.motivosImprocedencia.patchValue({
      submotivo: '',
      otroMotivo: '',
    });

    // Actualizar validaciones dinámicamente
    const submotivoControl = this.motivosImprocedencia.get('submotivo');
    const otroMotivoControl = this.motivosImprocedencia.get('otroMotivo');

    // Limpiar validadores anteriores
    submotivoControl?.clearValidators();
    otroMotivoControl?.clearValidators();

    // Agregar validadores según el motivo seleccionado
    if (
      this.motivoSeleccionado === 'expediente-incompleto' ||
      this.motivoSeleccionado === 'incongruencia-datos'
    ) {
      submotivoControl?.setValidators([Validators.required]);
    } else if (this.motivoSeleccionado === 'otro') {
      otroMotivoControl?.setValidators([Validators.required, Validators.minLength(10)]);
    }

    // Actualizar validación
    submotivoControl?.updateValueAndValidity();
    otroMotivoControl?.updateValueAndValidity();
  }

  getMotivoTexto(motivo: string): string {
    const motivos: { [key: string]: string } = {
      'expediente-no-cargado': 'Expediente no cargado en Buzón Electrónico del Poder Judicial',
      'expediente-incompleto': 'Expediente incompleto',
      'incongruencia-datos': 'Incongruencia de datos',
      'anotacion-realizada': 'Anotación que solicita ya fue realizada',
      otro: 'Otro motivo',
    };
    return motivos[motivo] || motivo;
  }

  getSubmotivoTexto(submotivo: string): string {
    const submotivos: { [key: string]: string } = {
      'falta-sentencia': 'Falta Sentencia',
      'falta-ejecutoria': 'Falta Ejecutoria',
      'nombres-contrayentes': 'En nombres de contrayentes',
      'regimen-patrimonial': 'En régimen patrimonial',
      'oficalia-no-corresponde': 'Oficialía no corresponde',
    };
    return submotivos[submotivo] || submotivo;
  }

  validarYEnviarImprocedencia(): void {
    if (this.motivosImprocedencia.valid) {
      const datos = {
        folio: this.folioActual,
        motivoPrincipal: this.motivoSeleccionado,
        motivoTexto: this.getMotivoTexto(this.motivoSeleccionado),
        submotivo: this.motivosImprocedencia.get('submotivo')?.value,
        submotivoTexto: this.getSubmotivoTexto(this.motivosImprocedencia.get('submotivo')?.value),
        otroMotivo: this.motivosImprocedencia.get('otroMotivo')?.value,
      };

      console.log('📋 Motivo de improcedencia:', datos);

      // Actualizar el estado de la solicitud a Improcedente
      this.filteredSolicitudes = this.filteredSolicitudes.map((solicitud) => {
        if (solicitud.folio === this.folioActual) {
          return { ...solicitud, estado: 'Improcedente' };
        }
        return solicitud;
      });
      this.updatePaginatedSolicitudes();

      alert('✅ Solicitud marcada como IMPROCEDENTE correctamente');

      // Limpiar formulario y estado
      this.motivosImprocedencia.reset();
      this.motivoSeleccionado = '';
      this.folioActual = '';
      this.closeDialog();
    } else {
      alert('⚠️ Por favor, completa todos los campos requeridos');
    }
  }

  public validarYEntregarAnotacion(): void {
    if (this.formAnotacion.valid) {
      console.log('📋 Anotación entregada:', this.formAnotacion.value);

      // Cambiar estado a "Escaneo Oficialía" en lugar de "Finalizada"
      this.filteredSolicitudes = this.filteredSolicitudes.map((solicitud) => {
        if (solicitud.folio === this.folioActual) {
          return { ...solicitud, estado: 'Escaneo Oficialía' };
        }
        return solicitud;
      });
      this.updatePaginatedSolicitudes();

      alert('✅ Anotación entregada correctamente. La solicitud pasó a estado "Escaneo Oficialía"');

      // Limpiar formulario y estado
      this.formAnotacion.reset();
      this.folioActual = '';
      this.closeDialog();
    } else {
      alert('⚠️ Por favor, completa todos los campos requeridos');
    }
  }

  public validarYSubirEscaneoOficialia(): void {
    if (this.formEscaneoOficialia.valid) {
      console.log('📋 Escaneo Oficialía subido:', this.formEscaneoOficialia.value);

      // Cambiar estado a "Escaneo Archivo"
      this.filteredSolicitudes = this.filteredSolicitudes.map((solicitud) => {
        if (solicitud.folio === this.folioActual) {
          return { ...solicitud, estado: 'Escaneo Archivo' };
        }
        return solicitud;
      });
      this.updatePaginatedSolicitudes();

      alert('✅ Escaneo de Oficialía registrado correctamente. La solicitud pasó a estado "Escaneo Archivo"');

      // Limpiar formulario y estado
      this.formEscaneoOficialia.reset();
      this.folioActual = '';
      this.closeDialog();
    } else {
      alert('⚠️ Por favor, adjunta el documento requerido');
    }
  }

  public validarYSubirEscaneoArchivo(): void {
    if (this.formEscaneoArchivo.valid) {
      console.log('📋 Escaneo Archivo subido:', this.formEscaneoArchivo.value);

      // Cambiar estado a "Finalizada"
      this.filteredSolicitudes = this.filteredSolicitudes.map((solicitud) => {
        if (solicitud.folio === this.folioActual) {
          return { ...solicitud, estado: 'Finalizada' };
        }
        return solicitud;
      });
      this.updatePaginatedSolicitudes();

      alert('✅ Escaneo de Archivo registrado correctamente. La solicitud ha sido FINALIZADA');

      // Limpiar formulario y estado
      this.formEscaneoArchivo.reset();
      this.folioActual = '';
      this.closeDialog();
    } else {
      alert('⚠️ Por favor, adjunta el documento requerido');
    }
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

  // Métodos para manejar el dialog
  openDialog(
    title: string,
    message: string,
    type:
      | 'info'
      | 'success'
      | 'danger'
      | 'warning'
      | 'entregaAnotacion'
      | 'escaneoOficialia'
      | 'escaneoArchivo' = 'info',
    confirmText: string = 'Aceptar',
    cancelText: string = 'Cancelar',
    showCancel: boolean = true,
    callback?: () => void
  ) {
    this.dialogTitle = title;
    this.dialogMessage = message;
    this.dialogType = type;
    this.dialogConfirmText = confirmText;
    this.dialogCancelText = cancelText;
    this.dialogShowCancel = showCancel;
    this.dialogCallback = callback || null;
    this.showDialog = true;
  }

  closeDialog() {
    this.documentos.reset();
    this.motivosImprocedencia.reset();
    this.formAnotacion.reset();
    this.formEscaneoOficialia.reset();
    this.formEscaneoArchivo.reset();
    this.selectedFiles = [];
    this.showDialog = false;
    this.dialogCallback = null;
  }

  onDialogConfirm() {
    // Manejar según el tipo de dialog
    if (this.dialogType === 'success') {
      // Dialog de documentos - ejecutar subida de archivos
      this.subirDocumentos();
    } else if (this.dialogType === 'danger') {
      // Dialog de improcedencia - validar y enviar motivo
      this.validarYEnviarImprocedencia();
    } else if (this.dialogType === 'entregaAnotacion') {
      // Dialog de entrega de anotación
      this.validarYEntregarAnotacion();
    } else if (this.dialogType === 'escaneoOficialia') {
      // Dialog de escaneo de Oficialía
      this.validarYSubirEscaneoOficialia();
    } else if (this.dialogType === 'escaneoArchivo') {
      // Dialog de escaneo de Archivo
      this.validarYSubirEscaneoArchivo();
    } else if (this.dialogCallback) {
      // Otros tipos de dialog - ejecutar callback genérico
      this.dialogCallback();
    }
  }

  public cancelarSolicitud(folio: string): void {
    // Guardar el folio para usarlo cuando se confirme
    this.folioActual = folio;

    this.openDialog(
      'Confirmar rechazo',
      `Selecciona el motivo de improcedencia para la solicitud ${folio}:`,
      'danger',
      'Rechazar',
      'Cancelar',
      true
      // Ya no necesitamos callback aquí, se maneja en onDialogConfirm
    );
  }

  public verDetalles(folio: string): void {
    this.router.navigate(['/solicitudes/' + folio]);
  }

  public aprobarSolicitud(folio: string): void {
    this.folioActual = folio;
    this.openDialog(
      'Confirmar aprobación',
      `Adjunta los siguientes documentos para la solicitud ${folio}:`,
      'success',
      'Aprobar',
      'Cancelar',
      true
    );
  }

  public verificarPago(lineaCaptura: string, folio: string): void {
    this.openDialog(
      'Verificar pago',
      `¿Deseas verificar el pago para la línea de captura: ${lineaCaptura}?`,
      'warning',
      'Verificar',
      'Cancelar',
      true,
      () => {
        this.filteredSolicitudes = this.filteredSolicitudes.map((solicitud) => {
          if (solicitud.folio === folio) {
            return { ...solicitud, estado: 'Pagada' };
          }
          return solicitud;
        });
        this.updatePaginatedSolicitudes();
      }
    );
  }

  public entregarAnotacion(folio: string): void {
    this.folioActual = folio;
    this.openDialog(
      'Entregar anotación',
      `Adjunte la anotación judicial correspondiente a la solicitud ${folio}`,
      'entregaAnotacion',
      'Entregar',
      'Cancelar',
      true
    );
  }

  public subirEscaneoOficialia(folio: string): void {
    this.folioActual = folio;
    this.openDialog(
      'Escaneo de Oficialía',
      `Adjunte el escaneo de la anotación realizado por la Oficialía para la solicitud ${folio}`,
      'escaneoOficialia',
      'Subir escaneo',
      'Cancelar',
      true
    );
  }

  public subirEscaneoArchivo(folio: string): void {
    this.folioActual = folio;
    this.openDialog(
      'Escaneo de Archivo Documental',
      `Adjunte el escaneo de la anotación realizado por el Archivo Documental para la solicitud ${folio}`,
      'escaneoArchivo',
      'Subir escaneo',
      'Cancelar',
      true
    );
  }
}
