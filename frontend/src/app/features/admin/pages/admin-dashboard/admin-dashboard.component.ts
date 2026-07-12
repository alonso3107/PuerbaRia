import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { AdminService, AdminUser, AdminVoucher, VoucherDecision } from '@features/admin/services/admin.service';
import { GestionCatalogoComponent } from '@features/admin/components/gestion-catalogo/gestion-catalogo.component';

/**
 * COMPONENTE DASHBOARD DE ADMINISTRACIÓN — PUERBA RIA
 * Permite a los administradores visualizar usuarios, vouchers y estadisticas.
 * Utiliza Angular Signals para manejar el estado local reactivamente.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    DialogModule,
    ProgressSpinnerModule,
    TableModule,
    TagModule,
    ToastModule,
    TooltipModule,
    GestionCatalogoComponent,
  ],
  providers: [MessageService],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly messageService = inject(MessageService);

  /** Señales de estado */
  readonly users = signal<AdminUser[]>([]);
  readonly vouchers = signal<AdminVoucher[]>([]);
  readonly isLoadingUsers = signal(true);
  readonly isLoadingVouchers = signal(true);
  readonly usersErrorMessage = signal('');
  readonly vouchersErrorMessage = signal('');
  readonly selectedVoucher = signal<AdminVoucher | null>(null);
  readonly isVoucherDialogVisible = signal(false);
  readonly openingVoucherId = signal<number | null>(null);
  readonly updatingVoucherId = signal<number | null>(null);

  /** Señal computada para contar la cantidad de administradores */
  readonly adminCount = computed(() => 
    this.users().filter((user) => user.role === 'ADMIN').length
  );

  readonly pendingVoucherCount = computed(() =>
    this.vouchers().filter((voucher) => voucher.estado === 'PENDIENTE').length
  );

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarVouchers();
  }

  /**
   * Realiza la llamada al servicio para obtener la lista de usuarios.
   */
  cargarUsuarios(): void {
    this.isLoadingUsers.set(true);
    this.usersErrorMessage.set('');

    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoadingUsers.set(false);
      },
      error: (error: Error) => {
        console.error('Error al cargar usuarios admin:', error);
        this.usersErrorMessage.set('No se pudo cargar la informacion de usuarios.');
        this.isLoadingUsers.set(false);
      },
    });
  }

  /**
   * Obtiene los vouchers subidos por los huespedes.
   */
  cargarVouchers(): void {
    this.isLoadingVouchers.set(true);
    this.vouchersErrorMessage.set('');

    this.adminService.getVouchers().subscribe({
      next: (vouchers) => {
        this.vouchers.set(vouchers);
        this.isLoadingVouchers.set(false);
      },
      error: (error: Error) => {
        console.error('Error al cargar vouchers admin:', error);
        this.vouchersErrorMessage.set('No se pudieron cargar los vouchers enviados.');
        this.isLoadingVouchers.set(false);
      },
    });
  }

  verDetalleVoucher(voucher: AdminVoucher): void {
    this.selectedVoucher.set(voucher);
    this.isVoucherDialogVisible.set(true);
  }

  cerrarDetalleVoucher(): void {
    this.isVoucherDialogVisible.set(false);
    this.selectedVoucher.set(null);
  }

  onVoucherDialogVisibleChange(isVisible: boolean): void {
    this.isVoucherDialogVisible.set(isVisible);

    if (!isVisible) {
      this.selectedVoucher.set(null);
    }
  }

  abrirArchivoVoucher(voucher: AdminVoucher): void {
    this.openingVoucherId.set(voucher.id);

    this.adminService.getVoucherArchivo(voucher.id).subscribe({
      next: (archivo) => {
        const archivoUrl = URL.createObjectURL(archivo);
        window.open(archivoUrl, '_blank', 'noopener');
        window.setTimeout(() => URL.revokeObjectURL(archivoUrl), 60000);
        this.openingVoucherId.set(null);
      },
      error: (error: Error) => {
        console.error('Error al abrir archivo de voucher:', error);
        this.vouchersErrorMessage.set('No se pudo abrir el archivo del voucher.');
        this.openingVoucherId.set(null);
      },
    });
  }

  actualizarEstadoVoucher(voucher: AdminVoucher, estado: VoucherDecision): void {
    this.updatingVoucherId.set(voucher.id);
    this.vouchersErrorMessage.set('');

    this.adminService.actualizarEstadoVoucher(voucher.id, estado).subscribe({
      next: (voucherActualizado) => {
        this.vouchers.update((vouchers) =>
          vouchers.map((item) => item.id === voucherActualizado.id ? voucherActualizado : item)
        );

        if (this.selectedVoucher()?.id === voucherActualizado.id) {
          this.selectedVoucher.set(voucherActualizado);
        }

        this.messageService.add({
          severity: estado === 'VALIDADO' ? 'success' : 'warn',
          summary: estado === 'VALIDADO' ? 'Voucher aprobado' : 'Voucher rechazado',
          detail: `${voucherActualizado.nombre} fue actualizado correctamente.`,
          life: 4200,
        });
        this.updatingVoucherId.set(null);
      },
      error: (error: Error) => {
        console.error('Error al actualizar estado de voucher:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo actualizar',
          detail: 'Revise la conexion con el backend e intente nuevamente.',
          life: 5000,
        });
        this.updatingVoucherId.set(null);
      },
    });
  }

  obtenerSeveridadVoucher(estado: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    if (estado === 'VALIDADO') {
      return 'success';
    }

    if (estado === 'RECHAZADO') {
      return 'danger';
    }

    return 'warn';
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
