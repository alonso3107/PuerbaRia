import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AdminVoucher {
  id: number;
  nombre: string;
  habitacion: string;
  tipoComprobante: string;
  monto: number;
  codigoOperacion: string;
  fechaPago: string;
  celular: string;
  archivoNombre: string | null;
  archivoTipo: string | null;
  estado: 'PENDIENTE' | 'VALIDADO' | 'RECHAZADO' | string;
  fechaSubida: string;
  archivoUrl: string;
}

export type VoucherDecision = 'VALIDADO' | 'RECHAZADO';

/**
 * SERVICIO DE ADMINISTRACIÓN — PUERBA RIA
 * Se encarga de las llamadas administrativas a la API del backend.
 * El interceptor global authInterceptor añade automáticamente el Bearer token JWT,
 * eliminando la necesidad de añadir cabeceras manuales en cada petición.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  /**
   * Obtiene la lista completa de usuarios registrados.
   *
   * @returns Observable con el arreglo de usuarios administrativos
   */
  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  /**
   * Obtiene los vouchers subidos por los huespedes para revision administrativa.
   */
  getVouchers(): Observable<AdminVoucher[]> {
    return this.http.get<AdminVoucher[]>(`${this.apiUrl}/vouchers`);
  }

  /**
   * Descarga el archivo de voucher usando el JWT del interceptor.
   */
  getVoucherArchivo(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/vouchers/${id}/archivo`, {
      responseType: 'blob',
    });
  }

  /**
   * Aprueba o rechaza un voucher desde el dashboard administrativo.
   */
  actualizarEstadoVoucher(id: number, estado: VoucherDecision): Observable<AdminVoucher> {
    return this.http.patch<AdminVoucher>(`${this.apiUrl}/vouchers/${id}/estado`, { estado });
  }
}
