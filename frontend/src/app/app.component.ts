import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { ToastModule } from 'primeng/toast';

/**
 * COMPONENTE PRINCIPAL — PUERBA RIA
 * Layout raíz que engloba la navegación (Navbar), el contenido principal (RouterOutlet) y el pie de página (Footer).
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
