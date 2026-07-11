import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { BarraProgresoScrollComponent } from '@shared/components/barra-progreso-scroll/barra-progreso-scroll.component';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';

interface Tratamiento {
  icono: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  precio: number;
}

interface Instalacion {
  nombre: string;
  descripcion: string;
  imagen: string;
}

interface Paquete {
  etiqueta: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  incluye: string[];
  duracion: string;
  precio: number;
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
export class SpaWellnessComponent {
  private readonly fb = inject(FormBuilder);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly tratamientos: Tratamiento[] = [
    {
      icono: 'pi-heart',
      nombre: 'Masaje Balinés',
      descripcion: 'Amasamientos profundos, presión en puntos energéticos y estiramientos pasivos con aceites tibios para liberar tensiones crónicas.',
      duracion: '75 min',
      precio: 320,
    },
    {
      icono: 'pi-star',
      nombre: 'Facial Luminosidad',
      descripcion: 'Tratamiento personalizado con activos marinos y ácido hialurónico. Revitaliza, ilumina y unifica el tono de la piel.',
      duracion: '60 min',
      precio: 280,
    },
    {
      icono: 'pi-cloud',
      nombre: 'Circuito Termal',
      descripcion: 'Sauna finlandesa, baño turco, ducha de contrastes y piscina climatizada con jets de hidromasaje.',
      duracion: '90 min',
      precio: 220,
    },
    {
      icono: 'pi-sparkles',
      nombre: 'Envoltura Corporal',
      descripcion: 'Exfoliación con sal de Maras seguida de envoltura de algas marinas y manteca de karité. Piel sedosa y nutrida.',
      duracion: '60 min',
      precio: 300,
    },
    {
      icono: 'pi-compass',
      nombre: 'Reflexología Podal',
      descripcion: 'Masaje en puntos reflejos de los pies que equilibra el sistema nervioso. Profundamente relajante.',
      duracion: '45 min',
      precio: 190,
    },
    {
      icono: 'pi-bolt',
      nombre: 'Masaje Deportivo',
      descripcion: 'Técnica intensiva sobre grupos musculares específicos. Ideal tras el surf o para liberar contracturas profundas.',
      duracion: '60 min',
      precio: 260,
    },
  ];

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

  readonly paquetes: Paquete[] = [
    {
      etiqueta: 'El más pedido',
      nombre: 'Escapada Renovadora',
      descripcion: 'Media jornada de bienestar intensivo para desconectar del mundo y reconectar contigo.',
      imagen: 'assets/spa/masaje-aceites.jpg',
      incluye: [
        'Masaje Balinés de 75 minutos',
        'Facial Luminosidad personalizado',
        'Circuito termal (2 horas)',
        'Almuerzo wellness en Mare Nostrum',
        'Kit de amenities orgánicos de regalo',
      ],
      duracion: '4 horas',
      precio: 750,
    },
    {
      etiqueta: 'Experiencia premium',
      nombre: 'Ritual del Pacífico',
      descripcion: 'Un día completo de bienestar que termina frente al mar, con cena degustación incluida.',
      imagen: 'assets/spa/ritual-facial.jpg',
      incluye: [
        'Circuito termal con acceso ilimitado',
        'Envoltura corporal de algas marinas',
        'Masaje Balinés de 90 minutos',
        'Sesión privada de yoga al atardecer',
        'Cena degustación en Mare Nostrum',
        'Zona VIP de relax con espumante',
      ],
      duracion: 'Día completo',
      precio: 1350,
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
