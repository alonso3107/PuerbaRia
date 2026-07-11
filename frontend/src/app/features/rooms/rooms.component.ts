import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '@core/services/auth.service';
import { CatalogoService, Habitacion } from '@core/services/catalogo.service';
import { BarraProgresoScrollComponent } from '@shared/components/barra-progreso-scroll/barra-progreso-scroll.component';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';

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
export class RoomsComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly habitaciones = signal<Habitacion[]>([]);
  readonly cargando = signal(this.isBrowser);
  readonly errorCarga = signal(false);
  readonly fotoActiva = signal<number[]>([]);

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

  ngOnInit(): void {
    if (this.isBrowser) {
      this.cargarHabitaciones();
    }
  }

  cargarHabitaciones(): void {
    this.cargando.set(true);
    this.errorCarga.set(false);

    this.catalogoService.getHabitaciones().subscribe({
      next: (habitaciones) => {
        this.habitaciones.set(habitaciones);
        this.fotoActiva.set(habitaciones.map(() => 0));
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar habitaciones:', error);
        this.errorCarga.set(true);
        this.cargando.set(false);
      },
    });
  }

  cambiarFoto(indiceHabitacion: number, salto: number): void {
    const total = this.habitaciones()[indiceHabitacion].fotos.length;
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
