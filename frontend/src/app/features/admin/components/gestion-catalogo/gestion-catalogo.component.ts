import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  CatalogoService,
  Habitacion,
  HabitacionPayload,
  PaqueteSpa,
  PaqueteSpaPayload,
  TratamientoSpa,
  TratamientoSpaPayload,
} from '@core/services/catalogo.service';

type SeccionCatalogo = 'habitaciones' | 'tratamientos' | 'paquetes';

/**
 * GESTIÓN DE CATÁLOGO — PUERBA RIA
 * CRUD administrativo de habitaciones, tratamientos y paquetes de spa.
 * Sigue el mismo patrón de tabla + diálogo + toasts usado en vouchers.
 */
@Component({
  selector: 'app-gestion-catalogo',
  standalone: true,
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    ProgressSpinnerModule,
    SelectModule,
    TableModule,
    TextareaModule,
    TooltipModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './gestion-catalogo.component.html',
  styleUrl: './gestion-catalogo.component.scss',
})
export class GestionCatalogoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogoService = inject(CatalogoService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly secciones: { valor: SeccionCatalogo; etiqueta: string }[] = [
    { valor: 'habitaciones', etiqueta: 'Habitaciones' },
    { valor: 'tratamientos', etiqueta: 'Tratamientos' },
    { valor: 'paquetes', etiqueta: 'Paquetes' },
  ];

  readonly iconosDisponibles = [
    'pi-heart', 'pi-star', 'pi-cloud', 'pi-sparkles', 'pi-compass',
    'pi-bolt', 'pi-sun', 'pi-moon', 'pi-shield', 'pi-globe',
  ];

  readonly seccionActiva = signal<SeccionCatalogo>('habitaciones');
  readonly habitaciones = signal<Habitacion[]>([]);
  readonly tratamientos = signal<TratamientoSpa[]>([]);
  readonly paquetes = signal<PaqueteSpa[]>([]);
  readonly cargando = signal(true);
  readonly errorMessage = signal('');
  readonly guardando = signal(false);
  readonly eliminandoId = signal<number | null>(null);

  readonly habitacionDialogVisible = signal(false);
  readonly tratamientoDialogVisible = signal(false);
  readonly paqueteDialogVisible = signal(false);

  private habitacionEnEdicion: Habitacion | null = null;
  private tratamientoEnEdicion: TratamientoSpa | null = null;
  private paqueteEnEdicion: PaqueteSpa | null = null;

  readonly habitacionForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    esencia: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    precio: [null, [Validators.required, Validators.min(1)]],
    tamano: [null, [Validators.required, Validators.min(1)]],
    capacidad: [null, [Validators.required, Validators.min(1)]],
    cama: ['', Validators.required],
    vista: ['', Validators.required],
    idealPara: ['', Validators.required],
    amenidades: ['', Validators.required],
    condiciones: ['', Validators.required],
    fotos: this.fb.array([this.crearFotoGroup()]),
  });

  readonly tratamientoForm: FormGroup = this.fb.group({
    icono: ['pi-heart', Validators.required],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    duracion: ['', [Validators.required, Validators.maxLength(50)]],
    precio: [null, [Validators.required, Validators.min(1)]],
  });

  readonly paqueteForm: FormGroup = this.fb.group({
    etiqueta: ['', [Validators.required, Validators.maxLength(100)]],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
    imagen: ['', Validators.required],
    duracion: ['', [Validators.required, Validators.maxLength(50)]],
    precio: [null, [Validators.required, Validators.min(1)]],
    incluye: ['', Validators.required],
  });

  get fotosFormArray(): FormArray {
    return this.habitacionForm.get('fotos') as FormArray;
  }

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo(): void {
    this.cargando.set(true);
    this.errorMessage.set('');

    forkJoin({
      habitaciones: this.catalogoService.getHabitaciones(),
      tratamientos: this.catalogoService.getTratamientos(),
      paquetes: this.catalogoService.getPaquetes(),
    }).subscribe({
      next: ({ habitaciones, tratamientos, paquetes }) => {
        this.habitaciones.set(habitaciones);
        this.tratamientos.set(tratamientos);
        this.paquetes.set(paquetes);
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        console.error('Error al cargar el catalogo:', error);
        this.errorMessage.set('No se pudo cargar el catalogo. Verifique la conexion con el backend.');
        this.cargando.set(false);
      },
    });
  }

  cambiarSeccion(seccion: SeccionCatalogo): void {
    this.seccionActiva.set(seccion);
  }

  // ── Habitaciones ──────────────────────────────────────────────

  nuevaHabitacion(): void {
    this.habitacionEnEdicion = null;
    this.habitacionForm.reset();
    this.reiniciarFotos([{ src: '', alt: '' }]);
    this.habitacionDialogVisible.set(true);
  }

  editarHabitacion(habitacion: Habitacion): void {
    this.habitacionEnEdicion = habitacion;
    this.habitacionForm.patchValue({
      ...habitacion,
      amenidades: habitacion.amenidades.join('\n'),
      condiciones: habitacion.condiciones.join('\n'),
    });
    this.reiniciarFotos(habitacion.fotos);
    this.habitacionDialogVisible.set(true);
  }

  agregarFoto(): void {
    this.fotosFormArray.push(this.crearFotoGroup());
  }

  quitarFoto(indice: number): void {
    if (this.fotosFormArray.length > 1) {
      this.fotosFormArray.removeAt(indice);
    }
  }

  guardarHabitacion(): void {
    if (this.habitacionForm.invalid) {
      this.habitacionForm.markAllAsTouched();
      return;
    }

    const valores = this.habitacionForm.getRawValue();
    const payload: HabitacionPayload = {
      ...valores,
      amenidades: this.aLineas(valores.amenidades),
      condiciones: this.aLineas(valores.condiciones),
    };

    const peticion = this.habitacionEnEdicion
      ? this.catalogoService.actualizarHabitacion(this.habitacionEnEdicion.id, payload)
      : this.catalogoService.crearHabitacion(payload);

    this.guardando.set(true);
    peticion.subscribe({
      next: (habitacion) => {
        this.actualizarLista(this.habitaciones, habitacion, this.habitacionEnEdicion?.id);
        this.notificarGuardado(habitacion.nombre);
        this.habitacionDialogVisible.set(false);
        this.guardando.set(false);
      },
      error: (error: unknown) => this.notificarError(error),
    });
  }

  eliminarHabitacion(habitacion: Habitacion): void {
    this.confirmarEliminacion(`la habitacion "${habitacion.nombre}"`, () => {
      this.eliminandoId.set(habitacion.id);
      this.catalogoService.eliminarHabitacion(habitacion.id).subscribe({
        next: () => this.quitarDeLista(this.habitaciones, habitacion.id, habitacion.nombre),
        error: (error: unknown) => this.notificarError(error),
      });
    });
  }

  // ── Tratamientos ──────────────────────────────────────────────

  nuevoTratamiento(): void {
    this.tratamientoEnEdicion = null;
    this.tratamientoForm.reset({ icono: 'pi-heart' });
    this.tratamientoDialogVisible.set(true);
  }

  editarTratamiento(tratamiento: TratamientoSpa): void {
    this.tratamientoEnEdicion = tratamiento;
    this.tratamientoForm.patchValue(tratamiento);
    this.tratamientoDialogVisible.set(true);
  }

  guardarTratamiento(): void {
    if (this.tratamientoForm.invalid) {
      this.tratamientoForm.markAllAsTouched();
      return;
    }

    const payload: TratamientoSpaPayload = this.tratamientoForm.getRawValue();
    const peticion = this.tratamientoEnEdicion
      ? this.catalogoService.actualizarTratamiento(this.tratamientoEnEdicion.id, payload)
      : this.catalogoService.crearTratamiento(payload);

    this.guardando.set(true);
    peticion.subscribe({
      next: (tratamiento) => {
        this.actualizarLista(this.tratamientos, tratamiento, this.tratamientoEnEdicion?.id);
        this.notificarGuardado(tratamiento.nombre);
        this.tratamientoDialogVisible.set(false);
        this.guardando.set(false);
      },
      error: (error: unknown) => this.notificarError(error),
    });
  }

  eliminarTratamiento(tratamiento: TratamientoSpa): void {
    this.confirmarEliminacion(`el tratamiento "${tratamiento.nombre}"`, () => {
      this.eliminandoId.set(tratamiento.id);
      this.catalogoService.eliminarTratamiento(tratamiento.id).subscribe({
        next: () => this.quitarDeLista(this.tratamientos, tratamiento.id, tratamiento.nombre),
        error: (error: unknown) => this.notificarError(error),
      });
    });
  }

  // ── Paquetes ──────────────────────────────────────────────────

  nuevoPaquete(): void {
    this.paqueteEnEdicion = null;
    this.paqueteForm.reset();
    this.paqueteDialogVisible.set(true);
  }

  editarPaquete(paquete: PaqueteSpa): void {
    this.paqueteEnEdicion = paquete;
    this.paqueteForm.patchValue({
      ...paquete,
      incluye: paquete.incluye.join('\n'),
    });
    this.paqueteDialogVisible.set(true);
  }

  guardarPaquete(): void {
    if (this.paqueteForm.invalid) {
      this.paqueteForm.markAllAsTouched();
      return;
    }

    const valores = this.paqueteForm.getRawValue();
    const payload: PaqueteSpaPayload = {
      ...valores,
      incluye: this.aLineas(valores.incluye),
    };

    const peticion = this.paqueteEnEdicion
      ? this.catalogoService.actualizarPaquete(this.paqueteEnEdicion.id, payload)
      : this.catalogoService.crearPaquete(payload);

    this.guardando.set(true);
    peticion.subscribe({
      next: (paquete) => {
        this.actualizarLista(this.paquetes, paquete, this.paqueteEnEdicion?.id);
        this.notificarGuardado(paquete.nombre);
        this.paqueteDialogVisible.set(false);
        this.guardando.set(false);
      },
      error: (error: unknown) => this.notificarError(error),
    });
  }

  eliminarPaquete(paquete: PaqueteSpa): void {
    this.confirmarEliminacion(`el paquete "${paquete.nombre}"`, () => {
      this.eliminandoId.set(paquete.id);
      this.catalogoService.eliminarPaquete(paquete.id).subscribe({
        next: () => this.quitarDeLista(this.paquetes, paquete.id, paquete.nombre),
        error: (error: unknown) => this.notificarError(error),
      });
    });
  }

  // ── Utilitarios ───────────────────────────────────────────────

  private crearFotoGroup(): FormGroup {
    return this.fb.group({
      src: ['', Validators.required],
      alt: ['', Validators.required],
    });
  }

  private reiniciarFotos(fotos: { src: string; alt: string }[]): void {
    this.fotosFormArray.clear();
    fotos.forEach((foto) => {
      const grupo = this.crearFotoGroup();
      grupo.patchValue(foto);
      this.fotosFormArray.push(grupo);
    });
  }

  private aLineas(texto: string): string[] {
    return texto
      .split(/\r?\n/)
      .map((linea) => linea.trim())
      .filter((linea) => linea.length > 0);
  }

  private actualizarLista<T extends { id: number }>(
    lista: ReturnType<typeof signal<T[]>>,
    elemento: T,
    idEditado: number | undefined,
  ): void {
    if (idEditado) {
      lista.update((items) => items.map((item) => (item.id === idEditado ? elemento : item)));
    } else {
      lista.update((items) => [...items, elemento]);
    }
  }

  private quitarDeLista<T extends { id: number }>(
    lista: ReturnType<typeof signal<T[]>>,
    id: number,
    nombre: string,
  ): void {
    lista.update((items) => items.filter((item) => item.id !== id));
    this.eliminandoId.set(null);
    this.messageService.add({
      severity: 'warn',
      summary: 'Eliminado',
      detail: `${nombre} se elimino del catalogo.`,
      life: 4200,
    });
  }

  private confirmarEliminacion(descripcion: string, alAceptar: () => void): void {
    this.confirmationService.confirm({
      header: 'Confirmar eliminacion',
      message: `Se eliminara ${descripcion} de forma permanente. Esta accion no se puede deshacer.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: alAceptar,
    });
  }

  private notificarGuardado(nombre: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Catalogo actualizado',
      detail: `${nombre} se guardo correctamente.`,
      life: 4200,
    });
  }

  private notificarError(error: unknown): void {
    console.error('Error en la gestion del catalogo:', error);
    this.guardando.set(false);
    this.eliminandoId.set(null);

    const detalle =
      error instanceof HttpErrorResponse && typeof error.error?.error === 'string'
        ? error.error.error
        : 'No se pudo completar la operacion. Intente nuevamente.';

    this.messageService.add({
      severity: 'error',
      summary: 'Operacion fallida',
      detail: detalle,
      life: 5000,
    });
  }
}
