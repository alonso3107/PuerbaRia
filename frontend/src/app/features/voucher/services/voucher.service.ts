import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, timeout } from 'rxjs';

/** Respuesta exitosa del backend al subir un voucher */
export interface VoucherResponse {
  mensaje: string;
  id: number;
  estado: string;
}

/** Error estructurado del backend */
export interface VoucherError {
  error: string;
}

/**
 * SERVICIO DE VOUCHER — PUERBA RIA
 * Comunica el formulario de upload-voucher con el backend Spring Boot.
 * Endpoint: POST /api/v1/vouchers (multipart/form-data)
 */
@Injectable({ providedIn: 'root' })
export class VoucherService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://proyect-mweb-back.onrender.com/api/v1/vouchers';

  /**
   * Envia el formulario de voucher al backend.
   *
   * @param formData FormData con los campos del formulario + el archivo
   * @returns Observable con la respuesta del servidor
   */
  enviarVoucher(formData: FormData): Observable<VoucherResponse> {
    return this.http.post<VoucherResponse>(this.apiUrl, formData).pipe(
      timeout(30000), // 30 segundos maximo
      catchError((error: unknown) => throwError(() => new Error(this.obtenerMensajeError(error))))
    );
  }

  private obtenerMensajeError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        return 'El servidor tardo demasiado en responder. Intente nuevamente.';
      }

      return error instanceof Error && error.message
        ? error.message
        : 'No se pudo enviar el voucher. Intente nuevamente.';
    }

    const mensajeBackend = this.extraerMensajeBackend(error.error);

    if (mensajeBackend) {
      return mensajeBackend;
    }

    const mensajesPorEstado: Record<number, string> = {
      0: 'No se pudo conectar con el servidor. Verifique que el backend este encendido en el puerto 8080.',
      400: 'Datos invalidos. Revise los campos del formulario.',
      401: 'Su sesion expiro. Inicie sesion nuevamente e intente enviar el voucher.',
      403: 'El servidor rechazo el envio del voucher. Verifique que el archivo no exceda 10MB e intente nuevamente.',
      413: 'El archivo es demasiado grande. Maximo 10MB.',
      415: 'El formato del archivo o de la solicitud no es valido. Use JPG, PNG, WEBP o PDF.',
      500: 'Error interno del servidor. Intente nuevamente mas tarde.',
    };

    return mensajesPorEstado[error.status] ?? `No se pudo enviar el voucher. Codigo HTTP ${error.status}.`;
  }

  private extraerMensajeBackend(error: unknown): string | null {
    if (!error) {
      return null;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (typeof error === 'object') {
      const posibleError = error as { error?: unknown; message?: unknown; detail?: unknown; title?: unknown };
      const mensaje = posibleError.error ?? posibleError.message ?? posibleError.detail ?? posibleError.title;

      return typeof mensaje === 'string' && mensaje.trim() ? mensaje : null;
    }

    return null;
  }
}
