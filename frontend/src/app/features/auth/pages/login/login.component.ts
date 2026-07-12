import { AfterViewInit, Component, ElementRef, NgZone, OnInit, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { MessageService } from 'primeng/api';
import { environment } from '@environments/environment';

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
export class LoginComponent implements OnInit, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  @ViewChild('botonGoogle') botonGoogle?: ElementRef<HTMLDivElement>;

  /** Formulario reactivo de inicio de sesión */
  readonly loginForm: FormGroup = this.fb.nonNullable.group({
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(254),
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(128),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/),
    ]]
  });

  /** Estados locales controlados mediante Signals */
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly passwordVisible = signal(false);
  readonly googleHabilitado = !!environment.googleClientId;

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

  ngAfterViewInit(): void {
    if (this.isBrowser && this.googleHabilitado) {
      this.prepararBotonGoogle();
    }
  }

  /**
   * Procesa el envío del formulario de inicio de sesión.
   * Realiza la validación y llama al servicio de autenticación.
   */
  onSubmit(): void {
    this.errorMessage.set('');

    const emailControl = this.loginForm.controls['email'];
    emailControl.setValue(emailControl.value.trim().toLowerCase());

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.redirigirSegunRol();
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

  alternarVisibilidadPassword(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  /**
   * Carga el script de Google Identity Services y dibuja el botón oficial.
   * Al confirmar la cuenta, Google entrega un ID token que el backend valida.
   */
  private prepararBotonGoogle(): void {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      const google = (window as any).google;
      if (!google || !this.botonGoogle) {
        return;
      }

      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (respuesta: { credential: string }) =>
          this.zone.run(() => this.ingresarConGoogle(respuesta.credential)),
      });

      const anchoBoton = Math.min(400, this.botonGoogle.nativeElement.clientWidth || 320);
      google.accounts.id.renderButton(this.botonGoogle.nativeElement, {
        theme: 'outline',
        size: 'large',
        width: anchoBoton,
        text: 'continue_with',
        locale: 'es',
      });
    };
    document.head.appendChild(script);
  }

  private ingresarConGoogle(credential: string): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.loginConGoogle(credential).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.redirigirSegunRol();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.status === 0
            ? 'No se pudo conectar con el servidor. Verifica que el backend este encendido.'
            : error.error?.error ?? 'No se pudo iniciar sesion con Google. Intente nuevamente.'
        );
      },
    });
  }

  private redirigirSegunRol(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
