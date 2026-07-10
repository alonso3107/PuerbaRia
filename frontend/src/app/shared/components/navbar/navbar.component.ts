import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { TemaService } from '@core/services/tema.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly temaService = inject(TemaService);

  // Exponemos las signals del servicio al template
  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isAdmin = this.authService.isAdmin;
  
  // Usamos signals para manejar el estado local del menú
  readonly isUserMenuOpen = signal<boolean>(false);
  readonly isMobileMenuOpen = signal<boolean>(false);

  /**
   * Alterna el menú de usuario.
   */
  toggleUserMenu(): void {
    this.isUserMenuOpen.update(open => !open);
  }

  /**
   * Cierra el menú de usuario.
   */
  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  /**
   * Alterna el menú móvil.
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(open => !open);
  }

  /**
   * Cierra el menú móvil.
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  /**
   * Cierra la sesión y redirige al usuario a la página de login.
   */
  logout(): void {
    this.authService.logout();
    this.isUserMenuOpen.set(false);
    this.isMobileMenuOpen.set(false);
    this.router.navigate(['/login']);
  }
}
