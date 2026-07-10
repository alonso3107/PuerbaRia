import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  // Control de formulario reactivo para el email con validación
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  
  // Signals para manejar los estados del envío del formulario
  readonly newsletterEnviando = signal<boolean>(false);
  readonly newsletterEnviado = signal<boolean>(false);

  /**
   * Procesa la suscripción al boletín informativo simulando una petición HTTP.
   */
  suscribirNewsletter(): void {
    if (this.emailControl.invalid) {
      this.emailControl.markAsTouched();
      return;
    }
    
    this.newsletterEnviando.set(true);
    setTimeout(() => {
      this.newsletterEnviando.set(false);
      this.newsletterEnviado.set(true);
      this.emailControl.reset();
      
      // Resetea el mensaje de éxito después de 5 segundos
      setTimeout(() => this.newsletterEnviado.set(false), 5000);
    }, 1200);
  }

  /**
   * Scroll back to top of the page (micro-interaction magic)
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
