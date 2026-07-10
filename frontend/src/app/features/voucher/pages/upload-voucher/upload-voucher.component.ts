import { Component, PLATFORM_ID, inject, signal, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { VoucherService } from '@features/voucher/services/voucher.service';
import { AuthService } from '@core/services/auth.service';

interface Paso {
  numero: number;
  titulo: string;
}

interface TipoComprobante {
  valor: string;
  etiqueta: string;
  icono: string;
}

/**
 * COMPONENTE SUBIR VOUCHER — PUERBA RIA
 * Stepper en 3 pasos: Reserva → Pago → Evidencia.
 * Conectado al backend Spring Boot via VoucherService.
 */
@Component({
  selector: 'app-upload-voucher',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, DatePickerModule, ToastModule, DialogModule],
  providers: [MessageService],
  templateUrl: './upload-voucher.component.html',
  styleUrl: './upload-voucher.component.scss',
})
export class UploadVoucherComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly voucherService = inject(VoucherService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit(): void {
    // Leer el query param ?room= e inicializar el formulario con el nombre de la habitacion
    const room = this.route.snapshot.queryParamMap.get('room');
    if (room) {
      this.formulario.patchValue({ habitacion: room });
    }
    
    // Auto-completar el nombre del usuario si existe
    if (this.authService.isAuthenticated()) {
        const user = this.authService.currentUser();
        if (user) {
            this.formulario.patchValue({ nombre: user.name });
        }
    }
  }

  /** Pasos del stepper */
  readonly pasos: Paso[] = [
    { numero: 1, titulo: 'Reserva' },
    { numero: 2, titulo: 'Pago' },
    { numero: 3, titulo: 'Evidencia' },
  ];

  /** Tipos de comprobante disponibles */
  readonly tiposComprobante: TipoComprobante[] = [
    { valor: 'yape', etiqueta: 'Yape', icono: 'pi pi-wallet' },
    { valor: 'plin', etiqueta: 'Plin', icono: 'pi pi-mobile' },
    { valor: 'transferencia', etiqueta: 'Transferencia', icono: 'pi pi-building-columns' },
  ];

  /** Opciones visuales de Habitacion */
  readonly opcionesHabitacion = [
    { 
      valor: 'suite-oceano', 
      etiqueta: 'Suite Oceano', 
      imagen: 'assets/suite-oceano.jpg', 
      desc: 'Vista panoramica y jacuzzi' 
    },
    { 
      valor: 'deluxe-costera', 
      etiqueta: 'Deluxe Costera', 
      imagen: 'assets/deluxe-costera.jpg', 
      desc: 'Balcon privado al mar' 
    },
    { 
      valor: 'bungalow-privado', 
      etiqueta: 'Bungalow Privado', 
      imagen: 'assets/bungalow-privado.jpg', 
      desc: 'Acceso directo a la playa' 
    },
    { 
      valor: 'superior-jardin', 
      etiqueta: 'Superior Jardin', 
      imagen: 'assets/superior-jardin.jpg', 
      desc: 'Naturaleza y relajacion' 
    }
  ];

  /** Estado del stepper mediante Signals */
  readonly pasoActual = signal(1);
  readonly maximoPasoAlcanzado = signal(1);

  /** Validacion para fechas (no permitir fechas anteriores a hoy) */
  readonly fechaMinima = new Date();

  /** Signals de estado */
  readonly terminosVisible = signal(false);

  /** Estado del formulario */
  readonly formulario: FormGroup = this.fb.group({
    // Paso 1 — Reserva
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    habitacion: ['', [Validators.required]],
    // Paso 2 — Pago
    tipoComprobante: ['yape', [Validators.required]],
    monto: ['', [Validators.required, Validators.min(0.01)]],
    codigoOperacion: ['', [Validators.required, Validators.minLength(6)]],
    fechaPago: ['', [Validators.required]],
    // Paso 3 — Evidencia
    celular: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    voucher: [null, [Validators.required]],
    aceptaTerminos: [false, [Validators.requiredTrue]],
  });

  /** Signals de estado */
  readonly archivoSeleccionado = signal<File | null>(null);
  readonly vistaPrevia = signal<string | ArrayBuffer | null>(null);
  readonly arrastrando = signal(false);
  readonly cargando = signal(false);
  readonly enviado = signal(false);
  readonly mensajeError = signal('');

  /** Retorna true si el paso actual es valido (permite avanzar) */
  private pasoEsValido(paso: number): boolean {
    switch (paso) {
      case 1:
        return (
          (this.formulario.get('nombre')?.valid ?? false) &&
          (this.formulario.get('habitacion')?.valid ?? false)
        );
      case 2:
        return (
          (this.formulario.get('monto')?.valid ?? false) &&
          (this.formulario.get('codigoOperacion')?.valid ?? false) &&
          (this.formulario.get('fechaPago')?.valid ?? false)
        );
      case 3:
        return (
          (this.formulario.get('celular')?.valid ?? false) &&
          (this.formulario.get('voucher')?.valid ?? false) &&
          (this.formulario.get('aceptaTerminos')?.valid ?? false)
        );
      default:
        return false;
    }
  }

  puedeIrAPaso(paso: number): boolean {
    if (paso <= this.maximoPasoAlcanzado()) return true;
    if (paso === this.pasoActual() + 1 && this.pasoEsValido(this.pasoActual())) return true;
    return false;
  }

  irAPaso(paso: number): void {
    if (this.puedeIrAPaso(paso)) {
      this.pasoActual.set(paso);
    }
  }

  pasoSiguiente(): void {
    this.marcarCamposPaso(this.pasoActual());
    if (this.pasoEsValido(this.pasoActual()) && this.pasoActual() < 3) {
      this.pasoActual.update((prev) => prev + 1);
      this.maximoPasoAlcanzado.update((max) => Math.max(max, this.pasoActual()));
    }
  }

  pasoAnterior(): void {
    if (this.pasoActual() > 1) {
      this.pasoActual.update((prev) => prev - 1);
    }
  }

  private marcarCamposPaso(paso: number): void {
    switch (paso) {
      case 1:
        this.formulario.get('nombre')?.markAsTouched();
        this.formulario.get('habitacion')?.markAsTouched();
        break;
      case 2:
        this.formulario.get('monto')?.markAsTouched();
        this.formulario.get('codigoOperacion')?.markAsTouched();
        this.formulario.get('fechaPago')?.markAsTouched();
        break;
      case 3:
        this.formulario.get('celular')?.markAsTouched();
        this.formulario.get('voucher')?.markAsTouched();
        this.formulario.get('aceptaTerminos')?.markAsTouched();
        break;
    }
  }

  onArchivoSeleccionado(event: any): void {
    const files = event.target?.files;
    if (files && files.length > 0) {
      this.procesarArchivo(files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrando.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrando.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.arrastrando.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.procesarArchivo(files[0]);
    }
  }

  private procesarArchivo(archivo: File): void {
    const permitidos = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!permitidos.includes(archivo.type)) {
      alert('Tipo de archivo no permitido. Solo JPG, PNG, WEBP o PDF.');
      return;
    }
    if (archivo.size > 10 * 1024 * 1024) {
      alert('El archivo excede el limite de 10MB.');
      return;
    }

    this.archivoSeleccionado.set(archivo);
    this.formulario.patchValue({ voucher: archivo });

    if (archivo.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => this.vistaPrevia.set(reader.result);
      reader.readAsDataURL(archivo);
    } else {
      this.vistaPrevia.set('pdf');
    }
  }

  removerArchivo(): void {
    this.archivoSeleccionado.set(null);
    this.vistaPrevia.set(null);
    this.formulario.patchValue({ voucher: null });
    this.formulario.get('voucher')?.markAsTouched();
  }

  /** Envia el formulario al backend */
  onSubmit(): void {
    this.mensajeError.set('');

    const archivo = this.archivoSeleccionado();
    if (!this.formulario.valid || !archivo) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando.set(true);

    // Construir FormData para enviar al backend
    const formData = new FormData();
    formData.append('nombre', this.formulario.get('nombre')!.value);
    formData.append('habitacion', this.formulario.get('habitacion')!.value);
    formData.append('tipoComprobante', this.formulario.get('tipoComprobante')!.value);
    formData.append('monto', this.formulario.get('monto')!.value);
    formData.append('codigoOperacion', this.formulario.get('codigoOperacion')!.value);
    formData.append('fechaPago', this.formatearFecha(this.formulario.get('fechaPago')!.value));
    formData.append('celular', this.formulario.get('celular')!.value);
    formData.append('archivo', archivo, archivo.name);

    this.voucherService.enviarVoucher(formData).subscribe({
      next: (respuesta) => {
        console.log('Voucher enviado:', respuesta);
        this.cargando.set(false);
        this.enviado.set(true);
        this.messageService.add({
          severity: 'success',
          summary: 'Voucher enviado',
          detail: 'Su comprobante fue recibido y sera revisado por administracion.',
          life: 5000,
        });
      },
      error: (error: Error) => {
        console.error('Error al enviar voucher:', error);
        this.mensajeError.set(error.message);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo enviar',
          detail: error.message,
          life: 5500,
        });
        this.cargando.set(false);
      },
    });
  }

  reiniciar(): void {
    this.formulario.reset({ tipoComprobante: 'yape' });
    this.archivoSeleccionado.set(null);
    this.vistaPrevia.set(null);
    this.pasoActual.set(1);
    this.maximoPasoAlcanzado.set(1);
    this.enviado.set(false);
    this.mensajeError.set('');
  }

  private formatearFecha(fecha: Date | string): string {
    if (fecha instanceof Date) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return fecha;
  }
}
