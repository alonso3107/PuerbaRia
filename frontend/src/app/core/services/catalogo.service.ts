import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface FotoHabitacion {
  src: string;
  alt: string;
}

export interface Habitacion {
  id: number;
  nombre: string;
  esencia: string;
  descripcion: string;
  precio: number;
  tamano: number;
  capacidad: number;
  cama: string;
  vista: string;
  idealPara: string;
  amenidades: string[];
  condiciones: string[];
  fotos: FotoHabitacion[];
}

export type HabitacionPayload = Omit<Habitacion, 'id'>;

export interface TratamientoSpa {
  id: number;
  icono: string;
  nombre: string;
  descripcion: string;
  duracion: string;
  precio: number;
}

export type TratamientoSpaPayload = Omit<TratamientoSpa, 'id'>;

export interface PaqueteSpa {
  id: number;
  etiqueta: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  duracion: string;
  precio: number;
  incluye: string[];
}

export type PaqueteSpaPayload = Omit<PaqueteSpa, 'id'>;

/**
 * SERVICIO DE CATÁLOGO — PUERBA RIA
 * Lecturas públicas de habitaciones y spa, y mutaciones administrativas.
 * El authInterceptor añade el Bearer token cuando existe sesión.
 */
@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly habitacionesUrl = `${environment.apiUrl}/habitaciones`;
  private readonly spaUrl = `${environment.apiUrl}/spa`;

  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.habitacionesUrl);
  }

  crearHabitacion(payload: HabitacionPayload): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.habitacionesUrl, payload);
  }

  actualizarHabitacion(id: number, payload: HabitacionPayload): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.habitacionesUrl}/${id}`, payload);
  }

  eliminarHabitacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.habitacionesUrl}/${id}`);
  }

  getTratamientos(): Observable<TratamientoSpa[]> {
    return this.http.get<TratamientoSpa[]>(`${this.spaUrl}/tratamientos`);
  }

  crearTratamiento(payload: TratamientoSpaPayload): Observable<TratamientoSpa> {
    return this.http.post<TratamientoSpa>(`${this.spaUrl}/tratamientos`, payload);
  }

  actualizarTratamiento(id: number, payload: TratamientoSpaPayload): Observable<TratamientoSpa> {
    return this.http.put<TratamientoSpa>(`${this.spaUrl}/tratamientos/${id}`, payload);
  }

  eliminarTratamiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.spaUrl}/tratamientos/${id}`);
  }

  getPaquetes(): Observable<PaqueteSpa[]> {
    return this.http.get<PaqueteSpa[]>(`${this.spaUrl}/paquetes`);
  }

  crearPaquete(payload: PaqueteSpaPayload): Observable<PaqueteSpa> {
    return this.http.post<PaqueteSpa>(`${this.spaUrl}/paquetes`, payload);
  }

  actualizarPaquete(id: number, payload: PaqueteSpaPayload): Observable<PaqueteSpa> {
    return this.http.put<PaqueteSpa>(`${this.spaUrl}/paquetes/${id}`, payload);
  }

  eliminarPaquete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.spaUrl}/paquetes/${id}`);
  }
}
