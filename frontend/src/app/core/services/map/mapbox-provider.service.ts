import { Injectable, ElementRef } from '@angular/core';
import { MapProvider, MapCoordinates, MapMarkerOptions } from '../../interfaces/map-provider.interface';
import { environment } from '../../../../environments/environment';
import type mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapboxProviderService implements MapProvider {
  private map: mapboxgl.Map | null = null;
  private markers: mapboxgl.Marker[] = [];
  private mapboxgl: typeof mapboxgl | null = null;

  async initializeMap(container: ElementRef, center: MapCoordinates, zoom: number): Promise<void> {
    const mapbox = await this.loadMapbox();

    this.map = new mapbox.Map({
      container: container.nativeElement,
      style: 'mapbox://styles/mapbox/light-v11', // Clean and modern light style
      center: [center.lng, center.lat],
      zoom: zoom,
      attributionControl: false // Cleaner UI, we can add a custom attribution if needed
    });

    // Add navigation controls (zoom in/out, rotation)
    this.map.addControl(new mapbox.NavigationControl(), 'top-right');
    this.map.on('error', (event) => {
      console.error('Mapbox reporto un error al cargar el mapa', event.error);
    });

    // Setup ResizeObserver to guarantee the map stays perfectly fitted within flexible containers
    const resizeObserver = new ResizeObserver(() => {
      if (this.map) {
        this.map.resize();
      }
    });
    resizeObserver.observe(container.nativeElement);

    // Save the observer to clean it up later if necessary, though it's optional 
    // since we destroy the map, we can attach it to the instance or just let it be GC'd when the element is removed.
    (this.map as any)._resizeObserver = resizeObserver;

    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        this.map?.resize();
        resolve();
      });
    });
  }

  addMarker(options: MapMarkerOptions): void {
    if (!this.map || !this.mapboxgl) return;

    // Create a custom DOM element for the marker to match the premium brand aesthetics
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.backgroundColor = 'var(--color-acento)'; // Using CSS variables for styling
    el.style.border = '2px solid white';
    el.style.borderRadius = '50%';
    el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    el.style.cursor = 'pointer';
    el.style.transition = 'transform 0.3s ease';
    
    // Add hover effect
    el.addEventListener('mouseenter', () => el.style.transform = 'scale(1.2)');
    el.addEventListener('mouseleave', () => el.style.transform = 'scale(1)');

    const marker = new this.mapboxgl.Marker({ element: el })
      .setLngLat([options.coordinates.lng, options.coordinates.lat]);

    if (options.popupHTML) {
      const popup = new this.mapboxgl.Popup({ offset: 25, closeButton: false, className: 'premium-popup' })
        .setHTML(options.popupHTML);
      marker.setPopup(popup);
    }

    marker.addTo(this.map);
    this.markers.push(marker);
  }

  destroyMap(): void {
    // Remove all markers
    this.markers.forEach(m => m.remove());
    this.markers = [];

    // Remove the map instance and its observer
    if (this.map) {
      if ((this.map as any)._resizeObserver) {
        ((this.map as any)._resizeObserver as ResizeObserver).disconnect();
      }
      this.map.remove();
      this.map = null;
    }
  }

  private async loadMapbox(): Promise<typeof mapboxgl> {
    if (this.mapboxgl) {
      return this.mapboxgl;
    }

    if (!environment.mapboxToken) {
      throw new Error('Mapbox token no configurado.');
    }

    const mapboxModule = await import('mapbox-gl');
    this.mapboxgl = mapboxModule.default;
    this.mapboxgl.accessToken = environment.mapboxToken;

    return this.mapboxgl;
  }
}
