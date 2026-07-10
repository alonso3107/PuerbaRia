import { Component, PLATFORM_ID, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '@shared/directives/scroll-animate.directive';

interface Experiencia {
  titulo: string;
  subtitulo: string;
  descripcion: string;
  imagen: string;
  enlace: string;
}

interface Caracteristica {
  titulo: string;
  descripcion: string;
}

/**
 * COMPONENTE DE INICIO (HOME) — PUERBA RIA
 * ------------------------------------------------------------
 * Página principal de la experiencia del resort. Cuenta con un diseño
 * limpio y editorial tipo revista, soporte para tema oscuro y animaciones 
 * de scroll fluidas.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ScrollAnimateDirective, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private readonly plataformaId = inject(PLATFORM_ID);
  private scrollListener?: () => void;

  /** Lista de experiencias destacadas con diseño asimétrico */
  readonly experiencias: Experiencia[] = [
    {
      titulo: 'Habitaciones',
      subtitulo: 'Confort & Elegancia',
      descripcion: 'Suites diseñadas con materiales nobles y vistas panorámicas al océano.',
      imagen: 'assets/home-habitacion-preview.jpg',
      enlace: '/habitaciones',
    },
    {
      titulo: 'Mare Nostrum',
      subtitulo: 'Alta Cocina',
      descripcion: 'Cocina de autor con ingredientes locales y maridajes excepcionales.',
      imagen: 'assets/home-restaurante-preview.jpg',
      enlace: '/restaurante',
    },
    {
      titulo: 'SPA & Wellness',
      subtitulo: 'Renovación Total',
      descripcion: 'Tratamientos holísticos inspirados en la brisa y los minerales del mar.',
      imagen: 'assets/home-spa-preview.jpg',
      enlace: '/spa-wellness',
    },
    {
      titulo: 'Espacios Interiores',
      subtitulo: 'Diseño & Atmósfera',
      descripcion: 'Arquitectura contemporánea que dialoga con la naturaleza costera.',
      imagen: 'assets/hotel-heroreal.jpg',
      enlace: '/contacto',
    },
  ];

  /** Características de valor del hotel */
  readonly caracteristicas: Caracteristica[] = [
    {
      titulo: 'Ubicación Privilegiada',
      descripcion: 'Frente al mar, rodeado de naturaleza virgen y paisajes inolvidables. El lugar perfecto para desconectar.',
    },
    {
      titulo: 'Servicio Excepcional',
      descripcion: 'Atención personalizada las 24 horas con el más alto estándar de hospitalidad mediterránea.',
    },
    {
      titulo: 'Diseño Sereno',
      descripcion: 'Espacios cuidadosamente diseñados para inspirar calma y bienestar. Arquitectura que abraza.',
    },
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.plataformaId)) return;
    this.iniciarParallax();
  }

  /**
   * Inicializa un efecto de parallax sutil en la imagen del Hero.
   * Modifica ligeramente el transform del contenedor al hacer scroll.
   */
  private iniciarParallax(): void {
    const imagenHero = document.getElementById('hero-imagen');
    if (!imagenHero) return;

    const handler = () => {
      const scrollY = window.scrollY;
      const velocidad = 0.15;
      const desplazamiento = scrollY * velocidad;
      imagenHero.style.transform = `translate3d(0, ${desplazamiento}px, 0) scale(1.05)`;
    };

    window.addEventListener('scroll', handler, { passive: true });
    this.scrollListener = () => window.removeEventListener('scroll', handler);
  }

  ngOnDestroy(): void {
    // Liberación del event listener de scroll para evitar fugas de memoria
    this.scrollListener?.();
  }

  /**
   * Realiza un desplazamiento suave de la pantalla hacia la sección especificada por su ID.
   * @param id Identificador HTML de la sección destino.
   */
  desplazarA(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
