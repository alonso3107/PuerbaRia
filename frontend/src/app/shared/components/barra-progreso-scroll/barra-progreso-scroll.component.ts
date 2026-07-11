import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-barra-progreso-scroll',
  standalone: true,
  template: '',
  host: { 'aria-hidden': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-acento);
      transform: scaleX(0);
      transform-origin: 0 50%;
      z-index: 60;
    }

    @supports (animation-timeline: scroll()) {
      :host {
        display: block;
        animation: progreso-lectura linear both;
        animation-timeline: scroll(root);
      }
    }

    @keyframes progreso-lectura {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
  `,
})
export class BarraProgresoScrollComponent {}
