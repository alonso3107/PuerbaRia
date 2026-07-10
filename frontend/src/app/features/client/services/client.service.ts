import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminVoucher } from '@features/admin/services/admin.service';
import { environment } from '@environments/environment';

/**
 * Servicio para consultar las reservas/vouchers del cliente logueado.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/client/vouchers`;

  getMyVouchers(): Observable<AdminVoucher[]> {
    return this.http.get<AdminVoucher[]>(this.apiUrl);
  }
}
