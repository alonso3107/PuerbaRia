import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MessageService } from 'primeng/api';

/**
 * COMPONENTE LOGIN
 * Permite el acceso a cuentas de usuario exclusivas.
 * Adopta señales para un control reactivo y moderno de estados locales.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);

  /** Formulario reactivo de inicio de sesión */
  readonly loginForm: FormGroup = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)]]
  });

  /** Estados locales controlados mediante Signals */
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    const intent = this.route.snapshot.queryParamMap.get('intent');
    const room = this.route.snapshot.queryParamMap.get('room');
    if (intent === 'reserve') {
      setTimeout(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Inicia Sesion o Registrate',
          detail: `Para reservar ${room ? 'la ' + room : 'tu habitacion'}, necesitas tener una cuenta.`,
          life: 6000
        });
      }, 300);
    }
  }

  /**
   * Procesa el envío del formulario de inicio de sesión.
   * Realiza la validación y llama al servicio de autenticación.
   */
  onSubmit(): void {
    this.errorMessage.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.status === 0
            ? 'No se pudo conectar con el servidor. Verifica que el backend este encendido.'
            : 'Correo o contrasena incorrectos.'
        );
      },
    });
  }
}
