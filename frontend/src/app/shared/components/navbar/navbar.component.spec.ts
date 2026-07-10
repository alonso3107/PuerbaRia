import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '@core/services/auth.service';
import { TemaService } from '@core/services/tema.service';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: any;
  let mockTemaService: any;
  let navigateSpy: any;

  beforeEach(async () => {
    mockAuthService = {
      currentUser: signal(null),
      isAuthenticated: signal(false),
      isAdmin: signal(false),
      logout: vi.fn(),
    };

    mockTemaService = {
      esOscuro: signal(false),
      alternarTema: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: TemaService, useValue: mockTemaService },
      ],
    }).compileComponents();

    navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería alternar el estado del menú de usuario', () => {
    expect(component.isUserMenuOpen()).toBe(false);
    component.toggleUserMenu();
    expect(component.isUserMenuOpen()).toBe(true);
    component.closeUserMenu();
    expect(component.isUserMenuOpen()).toBe(false);
  });

  it('debería alternar el estado del menú móvil', () => {
    expect(component.isMobileMenuOpen()).toBe(false);
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(true);
    component.closeMobileMenu();
    expect(component.isMobileMenuOpen()).toBe(false);
  });

  it('debería realizar logout correctamente', () => {
    component.isUserMenuOpen.set(true);
    component.isMobileMenuOpen.set(true);
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(component.isUserMenuOpen()).toBe(false);
    expect(component.isMobileMenuOpen()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
