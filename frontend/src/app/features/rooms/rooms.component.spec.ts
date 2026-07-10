import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RoomsComponent } from './rooms.component';
import { AuthService } from '@core/services/auth.service';
import { MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';

describe('RoomsComponent', () => {
  let component: RoomsComponent;
  let fixture: ComponentFixture<RoomsComponent>;

  beforeEach(async () => {
    // Definimos mock global para IntersectionObserver si no existe en el entorno de testing
    if (typeof window !== 'undefined' && !window.IntersectionObserver) {
      window.IntersectionObserver = class {
        root = null;
        rootMargin = '';
        thresholds = [];
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
      } as any;
    }

    await TestBed.configureTestingModule({
      imports: [RoomsComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isAuthenticated: vi.fn().mockReturnValue(false) } },
        { provide: MessageService, useValue: { add: vi.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente de habitaciones', () => {
    expect(component).toBeTruthy();
  });

  it('debería contener una lista de 4 habitaciones con amenidades', () => {
    expect(component.rooms.length).toBe(4);
    expect(component.rooms[0].nombre).toBe('Suite Oceano');
    expect(component.rooms[0].amenidades.length).toBeGreaterThan(0);
  });

  it('debería contener una lista de servicios incluidos', () => {
    expect(component.serviciosIncluidos.length).toBe(8);
  });
});
