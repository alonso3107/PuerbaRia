import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MAP_PROVIDER, MapCoordinates, MapMarkerOptions } from '../../../core/interfaces/map-provider.interface';
import { MapboxProviderService } from '../../../core/services/map/mapbox-provider.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    // Dependency Injection: Provide the Mapbox implementation for the MapProvider interface.
    // This allows swapping to GoogleMapsProviderService easily in the future.
    { provide: MAP_PROVIDER, useClass: MapboxProviderService }
  ]
})
export class MapComponent implements AfterViewInit, OnDestroy {
  // Use Angular v20+ signal-based inputs
  coordinates = input.required<MapCoordinates>();
  zoom = input<number>(15);
  popupHTML = input<string>('');

  // Signal-based view query for the container
  mapContainer = viewChild.required<ElementRef>('mapContainer');

  private mapProvider = inject(MAP_PROVIDER);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private isInitialized = false;

  readonly errorMessage = signal('');
  readonly isLoading = signal(true);

  ngAfterViewInit(): void {
    if (!this.isBrowser || this.isInitialized) {
      this.isLoading.set(false);
      return;
    }

    this.isInitialized = true;
    this.initMap(this.mapContainer(), this.coordinates(), this.zoom(), this.popupHTML());
  }

  private async initMap(container: ElementRef, coords: MapCoordinates, zoom: number, popup: string): Promise<void> {
    try {
      await this.mapProvider.initializeMap(container, coords, zoom);

      const markerOptions: MapMarkerOptions = {
        coordinates: coords,
        popupHTML: popup
      };

      this.mapProvider.addMarker(markerOptions);
      this.errorMessage.set('');
    } catch (error) {
      console.error('No se pudo inicializar el mapa de contacto', error);
      this.errorMessage.set('No se pudo cargar el mapa en este momento.');
    } finally {
      this.isLoading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.mapProvider.destroyMap();
  }
}
