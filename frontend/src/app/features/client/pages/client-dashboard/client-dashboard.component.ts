import { Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { AdminVoucher } from '@features/admin/services/admin.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DatePipe, DecimalPipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [TableModule, TagModule, DatePipe, DecimalPipe],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss'
})
export class ClientDashboardComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  
  vouchers = signal<AdminVoucher[]>([]);
  isLoading = signal<boolean>(this.isBrowser);

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.cargarReservas();
  }

  cargarReservas(): void {
    this.isLoading.set(true);
    this.clientService.getMyVouchers().subscribe({
      next: (data) => {
        this.vouchers.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando reservas', error);
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
}
