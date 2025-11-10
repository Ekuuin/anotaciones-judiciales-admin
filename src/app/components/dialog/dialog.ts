import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DialogConfig {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'danger' | 'warning';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss'
})
export class Dialog {
  @Input() show = false;
  @Input() title = 'Título del Dialog';
  @Input() message = 'Mensaje del dialog';
  @Input() type: 'info' | 'success' | 'danger' | 'warning' = 'info';
  @Input() confirmText = 'Aceptar';
  @Input() cancelText = 'Cancelar';
  @Input() showCancel = true;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.onClose();
  }

  onCancel() {
    this.cancel.emit();
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }

  onOverlayClick() {
    this.onCancel();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
