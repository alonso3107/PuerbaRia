import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let navigateSpy: any;

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn(),
      isAdmin: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: MessageService, useValue: { add: vi.fn() } },
      ],
    }).compileComponents();

    navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente de login', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar el formulario como inválido si los campos están vacíos', () => {
    component.onSubmit();
    expect(component.loginForm.invalid).toBe(true);
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('debería rechazar correos con espacios o sin dominio completo', () => {
    component.loginForm.setValue({
      email: 'usuario @dominio',
      password: 'Password123',
    });

    component.onSubmit();

    expect(component.loginForm.controls['email'].invalid).toBe(true);
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('debería normalizar el correo antes de autenticar', () => {
    component.loginForm.setValue({
      email: '  Usuario@Example.COM  ',
      password: 'Password123',
    });
    mockAuthService.login.mockReturnValue(of({ token: 'token-123', role: 'USER' }));
    mockAuthService.isAdmin = () => false;

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'usuario@example.com',
      password: 'Password123',
    });
  });

  it('debería exigir una contraseña robusta y con longitud segura', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password',
    });

    component.onSubmit();

    expect(component.loginForm.controls['password'].invalid).toBe(true);
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('debería alternar la visibilidad de la contraseña', () => {
    expect(component.passwordVisible()).toBe(false);

    component.alternarVisibilidadPassword();

    expect(component.passwordVisible()).toBe(true);
  });

  it('debería iniciar sesión correctamente para usuario estándar y navegar al inicio', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'Password123',
    });

    mockAuthService.login.mockReturnValue(of({ token: 'token-123', role: 'USER' }));
    mockAuthService.isAdmin = () => false;

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('debería iniciar sesión correctamente para administrador y navegar al dashboard de admin', () => {
    component.loginForm.setValue({
      email: 'admin@example.com',
      password: 'AdminPassword123',
    });

    mockAuthService.login.mockReturnValue(of({ token: 'admin-token', role: 'ADMIN' }));
    mockAuthService.isAdmin = () => true;

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('debería manejar errores de inicio de sesión correctamente', () => {
    component.loginForm.setValue({
      email: 'incorrect@example.com',
      password: 'WrongPassword123',
    });

    mockAuthService.login.mockReturnValue(throwError(() => ({ status: 401 })));

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Correo o contrasena incorrectos.');
  });

  it('debería manejar errores de conexión con el servidor (status 0)', () => {
    component.loginForm.setValue({
      email: 'incorrect@example.com',
      password: 'WrongPassword123',
    });

    mockAuthService.login.mockReturnValue(throwError(() => ({ status: 0 })));

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toContain('No se pudo conectar con el servidor');
  });
});
