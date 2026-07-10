import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';
import { MapComponent } from '@shared/components/map/map.component';
import { MapCoordinates } from '@core/interfaces/map-provider.interface';

/**
 * COMPONENTE CONTACTO
 * Formulario de contacto con validación reactiva estricta, mapa Mapbox
 * y datos de localización del hotel.
 */
@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule, ScrollAnimateDirective, MapComponent],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss',
})
export class ContactoComponent {
  private readonly fb = inject(FormBuilder);

  /** Opciones del select de asunto */
  readonly asuntos: string[] = [
    'Reservas y disponibilidad',
    'Restaurante Mare Nostrum',
    'SPA y Wellness',
    'Eventos y celebraciones',
    'Grupos y empresas',
    'Información general',
    'Sugerencias y comentarios',
    'Otro',
  ];

  /** Estado del formulario de contacto usando Reactive Forms */
  contactoForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    asunto: ['', [Validators.required]],
    telefono: ['', [Validators.pattern(/^\+?[0-9\s]{9,15}$/)]],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
  });

  /** Signals de estado para el envío del formulario */
  enviando = signal(false);
  enviado = signal(false);

  /** Datos del mapa */
  readonly hotelCoords: MapCoordinates = { lng: -75.7310, lat: -14.0700 };
  readonly hotelPopupInfo = `
    <div class="popup-title">Puerba Ria</div>
    <div class="popup-text">Av. Ayabaca 345<br/>Ica, Peru</div>
    <a href="https://maps.google.com/?q=-14.0700,-75.7310" target="_blank" rel="noopener" class="popup-link">Abrir en Maps &rarr;</a>
  `;

  /** Envia el formulario (simulado; en producción: httpClient.post) */
  enviarMensaje(): void {
    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    setTimeout(() => {
      this.enviando.set(false);
      this.enviado.set(true);
      
      this.contactoForm.reset({ asunto: '' });
      
      // Ocultar mensaje de éxito tras 6 segundos
      setTimeout(() => this.enviado.set(false), 6000);
    }, 1500);
  }
}
