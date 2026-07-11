import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '@core/services/auth.service';
import { BarraProgresoScrollComponent } from '@shared/components/barra-progreso-scroll/barra-progreso-scroll.component';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';

interface FotoHabitacion {
  src: string;
  alt: string;
}

interface Habitacion {
  nombre: string;
  esencia: string;
  precio: number;
  tamano: number;
  capacidad: number;
  cama: string;
  vista: string;
  descripcion: string;
  idealPara: string;
  amenidades: string[];
  condiciones: string[];
  fotos: FotoHabitacion[];
}

interface ServicioIncluido {
  icono: string;
  nombre: string;
  detalle: string;
}

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [DecimalPipe, RouterLink, ScrollAnimateDirective, BarraProgresoScrollComponent],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly rooms: Habitacion[] = [
    {
      nombre: 'Suite Océano',
      esencia: 'La suite insignia, frente al Pacífico',
      precio: 890,
      tamano: 65,
      capacidad: 2,
      cama: 'King size',
      vista: 'Mar, frontal',
      descripcion:
        'En el último piso, con el horizonte entero para ti. La terraza privada amueblada invita a desayunar sobre el mar; adentro, la bañera de hidromasaje en mármol y el vestidor independiente completan un espacio pensado para no tener que pedir nada.',
      idealPara: 'Aniversarios, lunas de miel y quienes celebran algo grande.',
      amenidades: [
        'Terraza privada amueblada',
        'Bañera de hidromasaje en mármol',
        'Vestidor independiente',
        'Minibar premium sin costo el primer día',
        'Cafetera de espresso',
        'Servicio de mayordomo',
      ],
      condiciones: ['Desayuno incluido', 'Cancelación gratuita hasta 48 h antes', 'Late check-out sujeto a disponibilidad'],
      fotos: [
        { src: 'assets/suite-oceano.jpg', alt: 'Dormitorio de la Suite Océano con ventanal hacia el Pacífico' },
        { src: 'assets/rooms/suite-oceano-panoramica.jpg', alt: 'El Pacífico visto desde la terraza de la suite' },
        { src: 'assets/rooms/suite-oceano-detalle.jpg', alt: 'Salón privado de la Suite Océano' },
        { src: 'assets/rooms/suite-oceano-atardecer.jpg', alt: 'Atardecer desde las camas balinesas junto a la piscina' },
      ],
    },
    {
      nombre: 'Deluxe Costera',
      esencia: 'Balcón propio y brisa de mar',
      precio: 640,
      tamano: 45,
      capacidad: 2,
      cama: 'Queen size',
      vista: 'Mar, lateral',
      descripcion:
        'La habitación favorita de quienes viajan en pareja. El balcón privado mira al mar de costado —perfecto para el café de la mañana—, la ducha de lluvia ocupa medio baño y el escritorio junto a la ventana convierte cualquier pendiente en un trámite con vista.',
      idealPara: 'Escapadas de fin de semana y viajes en pareja.',
      amenidades: [
        'Balcón privado con mesa para dos',
        'Ducha de lluvia efecto spa',
        'Escritorio con vista',
        'Minibar surtido',
        'Albornoz y zapatillas',
        'Blackout total para dormir de más',
      ],
      condiciones: ['Desayuno incluido', 'Cancelación gratuita hasta 48 h antes'],
      fotos: [
        { src: 'assets/deluxe-costera.jpg', alt: 'Habitación Deluxe Costera con vista lateral al mar' },
        { src: 'assets/rooms/deluxe-costera-cama.jpg', alt: 'Cama queen de la Deluxe Costera al caer la tarde' },
        { src: 'assets/rooms/deluxe-costera-noche.jpg', alt: 'Ambiente nocturno de la Deluxe Costera' },
      ],
    },
    {
      nombre: 'Bungalow Privado',
      esencia: 'Una casa junto a la playa, solo para ustedes',
      precio: 1350,
      tamano: 85,
      capacidad: 4,
      cama: 'King + 2 twin',
      vista: 'Jardín y playa',
      descripcion:
        'Independiente del edificio principal y a treinta pasos de la arena. Piscina propia rodeada de palmeras, cocina completa por si la sobremesa se alarga, sala de estar y dos baños: el espacio se organiza en torno a estar juntos sin estar encima.',
      idealPara: 'Familias y grupos de amigos que quieren privacidad total.',
      amenidades: [
        'Piscina privada entre palmeras',
        'Acceso directo a la playa',
        'Cocina completa equipada',
        'Sala de estar independiente',
        'Dos baños completos',
        'Estacionamiento privado',
      ],
      condiciones: ['Desayuno incluido para 4', 'Cancelación gratuita hasta 72 h antes', 'Admite mascotas pequeñas'],
      fotos: [
        { src: 'assets/bungalow-privado.jpg', alt: 'Bungalow Privado rodeado de vegetación' },
        { src: 'assets/rooms/bungalow-alberca.jpg', alt: 'Piscina del bungalow entre palmeras y terrazas de madera' },
        { src: 'assets/hotel-pool.jpg', alt: 'Zona de piscinas de Puerba Ría al mediodía' },
      ],
    },
    {
      nombre: 'Superior Jardín',
      esencia: 'Silencio, madera y verde por la ventana',
      precio: 420,
      tamano: 35,
      capacidad: 2,
      cama: 'Matrimonial',
      vista: 'Jardín interior',
      descripcion:
        'La puerta de entrada a Puerba Ría. Acogedora, bañada de luz natural y con los jardines como único paisaje sonoro. Todo lo esencial está resuelto —escritorio, minibar, caja fuerte— para que el presupuesto rinda sin renunciar al descanso.',
      idealPara: 'Viajeros de paso y estancias de trabajo.',
      amenidades: [
        'Vista a los jardines interiores',
        'Escritorio de trabajo',
        'Smart TV 55"',
        'Minibar',
        'Caja fuerte digital',
        'Aire acondicionado individual',
      ],
      condiciones: ['Desayuno incluido', 'Cancelación gratuita hasta 24 h antes'],
      fotos: [
        { src: 'assets/superior-jardin.jpg', alt: 'Habitación Superior Jardín con luz de la mañana' },
        { src: 'assets/rooms/superior-jardin-luz.jpg', alt: 'Detalle en madera de la Superior Jardín frente al jardín interior' },
        { src: 'assets/rooms/superior-jardin-terraza.jpg', alt: 'Solárium del hotel con los cerros de la costa al fondo' },
      ],
    },
  ];

  readonly serviciosIncluidos: ServicioIncluido[] = [
    { icono: 'pi-wifi', nombre: 'WiFi de alta velocidad', detalle: 'Fibra en habitaciones y áreas comunes' },
    { icono: 'pi-sun', nombre: 'Desayuno artesanal', detalle: 'Productos locales, de 7 a 11 h' },
    { icono: 'pi-clock', nombre: 'Room service 24 h', detalle: 'Carta completa a cualquier hora' },
    { icono: 'pi-sliders-h', nombre: 'Climatización individual', detalle: 'Control independiente en cada habitación' },
    { icono: 'pi-desktop', nombre: 'Smart TV 55"', detalle: 'Streaming con tus propias cuentas' },
    { icono: 'pi-lock', nombre: 'Caja fuerte digital', detalle: 'Con espacio para laptop' },
    { icono: 'pi-sparkles', nombre: 'Amenities premium', detalle: 'Línea de tocador artesanal' },
    { icono: 'pi-check-circle', nombre: 'Limpieza diaria', detalle: 'Cambio de toallas a pedido' },
  ];

  readonly fotoActiva = signal<number[]>(this.rooms.map(() => 0));

  cambiarFoto(indiceHabitacion: number, salto: number): void {
    const total = this.rooms[indiceHabitacion].fotos.length;
    this.fotoActiva.update((indices) => {
      const nuevos = [...indices];
      nuevos[indiceHabitacion] = (nuevos[indiceHabitacion] + salto + total) % total;
      return nuevos;
    });
  }

  irAFoto(indiceHabitacion: number, indiceFoto: number): void {
    this.fotoActiva.update((indices) => {
      const nuevos = [...indices];
      nuevos[indiceHabitacion] = indiceFoto;
      return nuevos;
    });
  }

  reservarHabitacion(room: Habitacion): void {
    if (!this.authService.isAuthenticated()) {
      this.messageService.add({
        severity: 'info',
        summary: 'Inicia sesión',
        detail: `Para reservar la ${room.nombre}, por favor inicia sesión primero.`,
        life: 5000,
      });
      this.router.navigate(['/login'], { queryParams: { intent: 'reserve', room: room.nombre } });
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Procesando reserva',
      detail: `Redirigiendo al pago para la ${room.nombre}`,
    });
    setTimeout(() => {
      this.router.navigate(['/subir-voucher'], { queryParams: { room: room.nombre } });
    }, 800);
  }
}
