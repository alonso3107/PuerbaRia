import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * SERVICIO DE TEMA — PUERBA RIA
 * Gestiona el cambio entre modo claro y oscuro con persistencia en localStorage.
 * Aplica la clase 'dark' al elemento <html> para activar los estilos del modo oscuro.
 */
@Injectable({ providedIn: 'root' })
export class TemaService {
  private readonly plataformaId = inject(PLATFORM_ID);

  /** Signal reactiva: true = modo oscuro activo */
  readonly esOscuro = signal(false);

  constructor() {
    this.inicializarTema();
  }

  /** Lee la preferencia guardada y la aplica al cargar la app */
  private inicializarTema(): void {
    if (!isPlatformBrowser(this.plataformaId)) return;

    const guardado = localStorage.getItem('puerbaria-tema');
    const prefiereOscuro = guardado === 'oscuro';

    // Si no hay preferencia guardada, respetar la del sistema operativo
    if (!guardado) {
      const sistemaOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.aplicarTema(sistemaOscuro);
      return;
    }

    this.aplicarTema(prefiereOscuro);
  }

  /** Alterna entre claro y oscuro */
  alternarTema(): void {
    const nuevo = !this.esOscuro();
    this.aplicarTema(nuevo);
  }

  /** Aplica el tema y persiste la eleccion */
  private aplicarTema(oscuro: boolean): void {
    this.esOscuro.set(oscuro);

    if (isPlatformBrowser(this.plataformaId)) {
      const html = document.documentElement;
      if (oscuro) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      localStorage.setItem('puerbaria-tema', oscuro ? 'oscuro' : 'claro');
    }
  }
}
