import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '@core/services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;
  let navigateSpy: any;

  beforeEach(async () => {
    mockAuthService = {
      register: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente de registro', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar el formulario como inválido si los campos están vacíos', () => {
    component.onSubmit();
    expect(component.registerForm.invalid).toBe(true);
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('debería registrar un usuario correctamente y navegar a la página principal', () => {
    component.registerForm.setValue({
      name: 'Cliente Nuevo',
      email: 'nuevo@example.com',
      password: 'Password123',
    });

    mockAuthService.register.mockReturnValue(of({ token: 'new-token', name: 'Cliente Nuevo' }));

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(mockAuthService.register).toHaveBeenCalledWith({
      name: 'Cliente Nuevo',
      email: 'nuevo@example.com',
      password: 'Password123',
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });

  it('debería manejar errores de registro correctamente', () => {
    component.registerForm.setValue({
      name: 'Cliente Nuevo',
      email: 'nuevo@example.com',
      password: 'Password123',
    });

    mockAuthService.register.mockReturnValue(throwError(() => ({ status: 400 })));

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('No se pudo crear la cuenta. Revisa los datos e intenta nuevamente.');
  });

  it('debería manejar errores de conexión con el servidor (status 0)', () => {
    component.registerForm.setValue({
      name: 'Cliente Nuevo',
      email: 'nuevo@example.com',
      password: 'Password123',
    });

    mockAuthService.register.mockReturnValue(throwError(() => ({ status: 0 })));

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toContain('No se pudo conectar con el servidor');
  });
});
