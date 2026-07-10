import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '@core/services/auth.service';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';

interface Habitacion {
  nombre: string;
  precio: number;
  tamano: number;
  capacidad: number;
  cama: string;
  imagen: string;
  descripcion: string;
  amenidades: string[];
}

interface ServicioIncluido {
  nombre: string;
}

/**
20:  * COMPONENTE DE HABITACIONES — PUERBA RIA
21:  * Muestra las suites y habitaciones del hotel con imágenes
22:  * individuales, descripciones detalladas y servicios incluidos.
23:  */
@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [ScrollAnimateDirective],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  /** Habitaciones del hotel con imágenes únicas y detalles de confort */
  readonly rooms: Habitacion[] = [
    {
      nombre: 'Suite Oceano',
      precio: 450,
      tamano: 65,
      capacidad: 2,
      cama: 'King size',
      imagen: 'assets/suite-oceano.jpg',
      descripcion: 'Nuestra suite insignia: 65 m² de puro lujo con vistas panorámicas al Pacífico. Terraza privada amueblada, baño de mármol con bañera de hidromasaje y vestidor independiente.',
      amenidades: ['Vista panorámica al mar', 'Terraza privada', 'Bañera de hidromasaje', 'Vestidor independiente', 'Minibar premium', 'Servicio de mayordomo'],
    },
    {
      nombre: 'Deluxe Costera',
      precio: 320,
      tamano: 45,
      capacidad: 2,
      cama: 'Queen size',
      imagen: 'assets/deluxe-costera.jpg',
      descripcion: 'Elegancia y confort con vistas parciales al mar. Baño con ducha de lluvia, zona de trabajo y balcón privado. La habitación perfecta para una escapada romántica.',
      amenidades: ['Vista parcial al mar', 'Balcón privado', 'Ducha de lluvia', 'Zona de trabajo', 'Minibar', 'Albornoz y zapatillas'],
    },
    {
      nombre: 'Bungalow Privado',
      precio: 680,
      tamano: 85,
      capacidad: 4,
      cama: 'King + 2 Twin',
      imagen: 'assets/bungalow-privado.jpg',
      descripcion: 'Un refugio independiente con acceso directo a la playa. Piscina privada, cocina completa y sala de estar. Ideal para familias o estancias prolongadas.',
      amenidades: ['Acceso directo a playa', 'Piscina privada', 'Cocina completa', 'Sala de estar', 'Dos baños completos', 'Parking privado'],
    },
    {
      nombre: 'Superior Jardin',
      precio: 250,
      tamano: 35,
      capacidad: 2,
      cama: 'Double',
      imagen: 'assets/superior-jardin.jpg',
      descripcion: 'Acogedora y luminosa, con vistas a nuestros jardines mediterráneos. Escritorio, minibar y todas las comodidades para una estancia perfecta.',
      amenidades: ['Vista al jardín', 'Escritorio', 'Minibar', 'Caja fuerte', 'TV Smart 55"', 'Aire acondicionado'],
    },
  ];

  /** Servicios incluidos en todas las habitaciones */
  readonly serviciosIncluidos: ServicioIncluido[] = [
    { nombre: 'WiFi Alta Velocidad' },
    { nombre: 'Café & Té Premium' },
    { nombre: 'Climatización Indiv.' },
    { nombre: 'Smart TV 55"' },
    { nombre: 'Caja Fuerte' },
    { nombre: 'Amenities de Lujo' },
    { nombre: 'Room Service 24h' },
    { nombre: 'Limpieza Diaria' }
  ];

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Maneja el clic en el botón de reservar de una habitación.
   * Si no está autenticado, redirige al login mostrando un toast recordatorio.
   */
  reservarHabitacion(room: Habitacion): void {
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({
        severity: 'info',
        summary: 'Inicia sesión',
        detail: `Para reservar la ${room.nombre}, por favor inicia sesión primero.`,
        life: 5000
      });
      this.router.navigate(['/login'], { queryParams: { intent: 'reserve', room: room.nombre } });
      return;
    }

    this.messageService.add({
        severity: 'info',
        summary: 'Procesando Reserva',
        detail: `Redirigiendo al pago para la suite: ${room.nombre}`,
    });
    setTimeout(() => {
        this.router.navigate(['/subir-voucher'], { queryParams: { room: room.nombre } });
    }, 800);
  }
}
