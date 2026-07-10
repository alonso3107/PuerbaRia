import { ElementRef, InjectionToken } from '@angular/core';

export interface MapCoordinates {
  lng: number;
  lat: number;
}

export interface MapMarkerOptions {
  coordinates: MapCoordinates;
  popupHTML?: string;
}

export interface MapProvider {
  /**
   * Initializes the map inside the given HTML element container
   */
  initializeMap(container: ElementRef, center: MapCoordinates, zoom: number): Promise<void>;

  /**
   * Adds a custom marker to the map
   */
  addMarker(options: MapMarkerOptions): void;

  /**
   * Cleans up resources, event listeners, etc.
   */
  destroyMap(): void;
}

export const MAP_PROVIDER = new InjectionToken<MapProvider>('MAP_PROVIDER');
