import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';

interface Tratamiento {
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
  incluye: string[];
  duracion: string;
  precio: number;
}

interface FormularioConsulta {
  nombre: string;
  email: string;
  telefono: string;
  interes: string;
  fecha: Date | null;
  mensaje: string;
}

/**
 * COMPONENTE SPA & WELLNESS
 * Centro de bienestar del hotel: tratamientos, instalaciones,
 * paquetes experienciales y formulario de consulta.
 */
@Component({
  selector: 'app-spa-wellness',
  standalone: true,
  imports: [ScrollAnimateDirective, RouterLink, ReactiveFormsModule, DatePickerModule],
  templateUrl: './spa-wellness.component.html',
  styleUrl: './spa-wellness.component.scss',
})
export class SpaWellnessComponent {
  private readonly fb = inject(FormBuilder);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Tratamientos individuales */
  readonly tratamientos: Tratamiento[] = [
    {
      nombre: 'Masaje Balines',
      descripcion: 'Técnica ancestral que combina amasamientos profundos, presión en puntos energéticos y estiramientos pasivos para liberar tensiones crónicas.',
      duracion: '75 min',
      precio: 140,
    },
    {
      nombre: 'Facial Luminosidad',
      descripcion: 'Tratamiento facial personalizado con activos marinos y ácido hialurónico. Revitaliza, ilumina y unifica el tono de la piel.',
      duracion: '60 min',
      precio: 120,
    },
    {
      nombre: 'Circuito Termal',
      descripcion: 'Recorrido por sauna finlandesa, baño turco, ducha de contrastes y piscina climatizada con jets de hidromasaje.',
      duracion: '90 min',
      precio: 95,
    },
    {
      nombre: 'Envoltura Corporal',
      descripcion: 'Exfoliación con sales del Mar Muerto seguida de envoltura de algas marinas y manteca de karité. Piel sedosa y nutrida.',
      duracion: '60 min',
      precio: 130,
    },
    {
      nombre: 'Reflexologia Podal',
      descripcion: 'Masaje en puntos reflejos de los pies que equilibra el sistema nervioso y energético. Profundamente relajante.',
      duracion: '45 min',
      precio: 85,
    },
    {
      nombre: 'Masaje Deportivo',
      descripcion: 'Técnica intensiva enfocada en grupos musculares específicos. Ideal para deportistas o para liberar contracturas profundas.',
      duracion: '60 min',
      precio: 110,
    },
  ];

  /** Instalaciones del centro wellness */
  readonly instalaciones: Instalacion[] = [
    {
      nombre: 'Piscina Climatizada',
      descripcion: 'Piscina interior a 28°C con jets de hidromasaje, cascada y vistas al jardín mediterráneo.',
      imagen: 'assets/spa-tratamiento.jpg',
    },
    {
      nombre: 'Sala de Yoga',
      descripcion: 'Espacio sereno con suelo de madera de bambú. Clases grupales y sesiones privadas al amanecer.',
      imagen: 'assets/yoga-meditacion.jpg',
    },
    {
      nombre: 'Gimnasio',
      descripcion: 'Equipamiento Technogym de última generación. Entrenador personal bajo reserva.',
      imagen: 'assets/gimnasio-hotel.jpg',
    },
    {
      nombre: 'Zona de Relax',
      descripcion: 'Hamacas balinesas, infusiones orgánicas y vistas al horizonte. El cierre perfecto para cualquier tratamiento.',
      imagen: 'assets/hotel-pool.jpg',
    },
  ];

  /** Paquetes experienciales */
  readonly paquetes: Paquete[] = [
    {
      etiqueta: 'Más Popular',
      nombre: 'Escapada Renovadora',
      descripcion: 'Media jornada de bienestar intensivo para desconectar del mundo y reconectar consigo mismo.',
      incluye: [
        'Masaje Balinés de 75 minutos',
        'Facial Luminosidad personalizado',
        'Acceso al circuito termal (2 horas)',
        'Almuerzo wellness en Mare Nostrum',
        'Kit de amenities orgánicos de regalo',
      ],
      duracion: '4 horas',
      precio: 320,
    },
    {
      etiqueta: 'Experiencia Premium',
      nombre: 'Ritual Mediterráneo',
      descripcion: 'Jornada completa de bienestar inspirada en los rituales de las culturas del Mare Nostrum.',
      incluye: [
        'Circuito termal completo (acceso ilimitado)',
        'Envoltura corporal de algas marinas',
        'Masaje Balinés de 90 minutos',
        'Sesión privada de yoga al atardecer',
        'Cena degustación en Mare Nostrum',
        'Acceso a zona VIP de relax con champagne',
      ],
      duracion: 'Día completo',
      precio: 590,
    },
  ];

  /** Opciones del select de interés */
  readonly opcionesInteres: string[] = [
    'Masajes y tratamientos corporales',
    'Tratamientos faciales',
    'Circuito termal',
    'Paquetes wellness',
    'Yoga y meditación',
    'Gimnasio y entrenamiento personal',
    'Quiero un plan personalizado',
  ];

  /** Fecha mínima permitida para consultas (hoy) */
  readonly fechaMinima = new Date();

  /** Estado del formulario de contacto del Spa usando Reactive Forms */
  consultaForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern(/^\+?[0-9\s]{9,15}$/)]],
    interes: ['', [Validators.required]],
    fecha: [null],
    mensaje: ['']
  });

  /** Signals de estado para el envío del formulario */
  enviando = signal(false);
  enviado = signal(false);

  /** Simulación de envío de consulta al backend */
  enviarConsulta(): void {
    if (this.consultaForm.invalid) {
      this.consultaForm.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    // Simulación de respuesta asíncrona del servidor
    setTimeout(() => {
      this.enviando.set(false);
      this.enviado.set(true);
      this.consultaForm.reset({ interes: '' });
      setTimeout(() => this.enviado.set(false), 6000);
    }, 1500);
  }

  /** Signal para controlar el carrusel de tratamientos */
  indiceCarrusel = signal(0);

  carruselAnterior(): void {
    if (this.indiceCarrusel() > 0) {
      this.indiceCarrusel.update(val => val - 1);
    }
  }

  carruselSiguiente(): void {
    if (this.indiceCarrusel() < this.tratamientos.length - 1) {
      this.indiceCarrusel.update(val => val + 1);
    }
  }

  irACarrusel(indice: number): void {
    this.indiceCarrusel.set(indice);
  }

  /** Signal para controlar la navegación de instalaciones */
  indiceInstalacion = signal(0);

  instalacionAnterior(): void {
    this.indiceInstalacion.update(val => 
      val > 0 ? val - 1 : this.instalaciones.length - 1
    );
  }

  instalacionSiguiente(): void {
    this.indiceInstalacion.update(val => 
      val < this.instalaciones.length - 1 ? val + 1 : 0
    );
  }

  irAInstalacion(indice: number): void {
    this.indiceInstalacion.set(indice);
  }

  /** Desplazamiento suave a una sección de la página */
  desplazarA(id: string): void {
    if (typeof document !== 'undefined') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
