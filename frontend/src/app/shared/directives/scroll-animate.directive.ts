import { Directive, ElementRef, Input, AfterViewInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * DIRECTIVA SCROLL ANIMATE — PUERBA RIA
 * ------------------------------------------------------------
 * Esta directiva se encarga de vigilar la entrada de elementos en la pantalla
 * (viewport) del usuario para disparar animaciones CSS de forma progresiva.
 * 
 * Se implementa con IntersectionObserver para evitar problemas de rendimiento
 * asociados con escuchar el evento 'scroll' global.
 */
@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective implements AfterViewInit, OnDestroy {
  private readonly elemento = inject(ElementRef);
  private readonly plataformaId = inject(PLATFORM_ID);
  private observador?: IntersectionObserver;
  private animado = false;

  /** Tipo de animación CSS a aplicar de acuerdo a los estilos de la app */
  @Input('animationType') tipoAnimacion: 'revelar' | 'revelarArriba' | 'deslizar' | 'fundido' | 'fadeIn' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' = 'revelar';

  /** Retraso opcional en milisegundos para lograr secuencias de entrada atractivas */
  @Input() animationDelay = 0;

  ngAfterViewInit(): void {
    // Si la renderización ocurre en el servidor (SSR), evitamos usar IntersectionObserver
    // para prevenir errores y simplemente removemos la opacidad inicial.
    if (!isPlatformBrowser(this.plataformaId)) {
      this.elemento.nativeElement.classList.remove('scroll-oculto', 'opacity-0');
      return;
    }

    const elemento = this.elemento.nativeElement as HTMLElement;

    // Aseguramos el estado oculto inicial del elemento
    if (!elemento.classList.contains('scroll-oculto') && !elemento.classList.contains('opacity-0')) {
      elemento.classList.add('scroll-oculto');
    }

    // Mapeo entre los tipos semánticos de animación y las clases configuradas en Tailwind v4 (styles.scss)
    const mapaClases: Record<string, string> = {
      revelar: 'scroll-animate-revelar',
      revelarArriba: 'scroll-animate-revelarArriba',
      deslizar: 'scroll-animate-deslizar',
      fundido: 'scroll-animate-fundido',
      fadeIn: 'scroll-animate-fadeIn',
      fadeInUp: 'scroll-animate-fadeInUp',
      fadeInLeft: 'scroll-animate-fadeInLeft',
      fadeInRight: 'scroll-animate-fadeInRight',
    };

    const claseAnimacion = mapaClases[this.tipoAnimacion] || 'scroll-animate-revelar';

    // Configuramos el observador de intersección. Se define un threshold del 15% 
    // y un rootMargin de -60px para que los elementos se animen justo antes de cruzar la línea visual.
    this.observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting && !this.animado) {
            this.animado = true;
            setTimeout(() => {
              elemento.classList.remove('scroll-oculto', 'opacity-0');
              elemento.classList.add(claseAnimacion);
            }, this.animationDelay);
            this.observador?.unobserve(elemento);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    this.observador.observe(elemento);
  }

  ngOnDestroy(): void {
    // Limpieza del observador para evitar fugas de memoria al destruir el componente
    this.observador?.disconnect();
  }
}
