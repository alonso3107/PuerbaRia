import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/**
 * COMPONENTE REGISTER
 * Permite la creación y registro de nuevas cuentas de usuario.
 * Utiliza Signals para gestionar estados reactivos locales.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** Formulario reactivo de registro de usuario */
  readonly registerForm: FormGroup = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)]]
  });

  /** Estados locales controlados mediante Signals */
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  /**
   * Procesa el envío del formulario de registro.
   * Realiza la validación e invoca el servicio de registro.
   */
  onSubmit(): void {
    this.errorMessage.set('');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.status === 0
            ? 'No se pudo conectar con el servidor. Verifica que el backend este encendido.'
            : 'No se pudo crear la cuenta. Revisa los datos e intenta nuevamente.'
        );
      },
    });
  }
}
