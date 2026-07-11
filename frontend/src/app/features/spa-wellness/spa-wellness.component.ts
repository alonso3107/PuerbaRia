import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { forkJoin } from 'rxjs';
import { CatalogoService, PaqueteSpa, TratamientoSpa } from '@core/services/catalogo.service';
import { BarraProgresoScrollComponent } from '@shared/components/barra-progreso-scroll/barra-progreso-scroll.component';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';

interface Instalacion {
  nombre: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-spa-wellness',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink,
    ReactiveFormsModule,
    DatePickerModule,
    ScrollAnimateDirective,
    BarraProgresoScrollComponent,
  ],
  templateUrl: './spa-wellness.component.html',
  styleUrl: './spa-wellness.component.scss',
})
export class SpaWellnessComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly catalogoService = inject(CatalogoService);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly tratamientos = signal<TratamientoSpa[]>([]);
  readonly paquetes = signal<PaqueteSpa[]>([]);
  readonly cargando = signal(this.isBrowser);
  readonly errorCarga = signal(false);

  readonly instalaciones: Instalacion[] = [
    {
      nombre: 'Piscina Climatizada',
      descripcion: 'Piscina interior a 28 °C con jets de hidromasaje, cascada y vistas al jardín.',
      imagen: 'assets/hotel-pool.jpg',
    },
    {
      nombre: 'Sala de Yoga',
      descripcion: 'Espacio sereno con suelo de bambú. Clases grupales y sesiones privadas al amanecer.',
      imagen: 'assets/yoga-meditacion.jpg',
    },
    {
      nombre: 'Gimnasio',
      descripcion: 'Equipamiento Technogym de última generación. Entrenador personal bajo reserva.',
      imagen: 'assets/gimnasio-hotel.jpg',
    },
    {
      nombre: 'Zona de Relax',
      descripcion: 'Hamacas balinesas, infusiones orgánicas y vistas al horizonte del Pacífico.',
      imagen: 'assets/home-experiencia-spa.jpg',
    },
  ];

  readonly opcionesInteres: string[] = [
    'Masajes y tratamientos corporales',
    'Tratamientos faciales',
    'Circuito termal',
    'Paquetes wellness',
    'Yoga y meditación',
    'Gimnasio y entrenamiento personal',
    'Quiero un plan personalizado',
  ];

  readonly fechaMinima = new Date();

  consultaForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern(/^\+?[0-9\s]{9,15}$/)]],
    interes: ['', [Validators.required]],
    fecha: [null],
    mensaje: [''],
  });

  readonly enviando = signal(false);
  readonly enviado = signal(false);
  readonly indiceInstalacion = signal(0);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.cargarCatalogo();
    }
  }

  cargarCatalogo(): void {
    this.cargando.set(true);
    this.errorCarga.set(false);

    forkJoin({
      tratamientos: this.catalogoService.getTratamientos(),
      paquetes: this.catalogoService.getPaquetes(),
    }).subscribe({
      next: ({ tratamientos, paquetes }) => {
        this.tratamientos.set(tratamientos);
        this.paquetes.set(paquetes);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar el catálogo del spa:', error);
        this.errorCarga.set(true);
        this.cargando.set(false);
      },
    });
  }

  enviarConsulta(): void {
    if (this.consultaForm.invalid) {
      this.consultaForm.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    setTimeout(() => {
      this.enviando.set(false);
      this.enviado.set(true);
      this.consultaForm.reset({ interes: '' });
      setTimeout(() => this.enviado.set(false), 6000);
    }, 1500);
  }

  instalacionAnterior(): void {
    this.indiceInstalacion.update((valor) => (valor > 0 ? valor - 1 : this.instalaciones.length - 1));
  }

  instalacionSiguiente(): void {
    this.indiceInstalacion.update((valor) => (valor < this.instalaciones.length - 1 ? valor + 1 : 0));
  }

  desplazarA(id: string): void {
    if (typeof document !== 'undefined') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
