import { Component, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { AdminVoucher } from '@features/admin/services/admin.service';
import { AuthService } from '@core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DatePipe, DecimalPipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [RouterLink, ButtonModule, TableModule, TagModule, DatePipe, DecimalPipe],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss'
})
export class ClientDashboardComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly authService = inject(AuthService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly vouchers = signal<AdminVoucher[]>([]);
  readonly isLoading = signal<boolean>(this.isBrowser);
  readonly errorMessage = signal('');

  readonly nombreHuesped = computed(() => {
    const nombre = this.authService.currentUser()?.name ?? '';
    return nombre.split(' ')[0] || 'huésped';
  });

  readonly reservasValidadas = computed(() =>
    this.vouchers().filter((voucher) => voucher.estado === 'VALIDADO').length
  );

  readonly reservasPendientes = computed(() =>
    this.vouchers().filter((voucher) => voucher.estado === 'PENDIENTE').length
  );

  readonly montoValidado = computed(() =>
    this.vouchers()
      .filter((voucher) => voucher.estado === 'VALIDADO')
      .reduce((total, voucher) => total + voucher.monto, 0)
  );

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.cargarReservas();
  }

  cargarReservas(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.clientService.getMyVouchers().subscribe({
      next: (data) => {
        this.vouchers.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando reservas', error);
        this.errorMessage.set('No pudimos cargar tus reservas. Intenta nuevamente.');
        this.isLoading.set(false);
      }
    });
  }

  getSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    switch (status) {
      case 'VALIDADO':
        return 'success';
      case 'RECHAZADO':
        return 'danger';
      case 'PENDIENTE':
        return 'warn';
      default:
        return 'info';
    }
  }

  obtenerEtiquetaComprobante(tipo: string): string {
    const etiquetas: Record<string, string> = {
      yape: 'Yape',
      plin: 'Plin',
      transferencia: 'Transferencia',
    };

    return etiquetas[tipo] ?? tipo;
  }
}
