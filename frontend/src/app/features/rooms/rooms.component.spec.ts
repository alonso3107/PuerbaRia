import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { RoomsComponent } from './rooms.component';
import { AuthService } from '@core/services/auth.service';
import { CatalogoService, Habitacion } from '@core/services/catalogo.service';
import { MessageService } from 'primeng/api';
import { provideRouter } from '@angular/router';

const habitacionesMock: Habitacion[] = [
  {
    id: 1,
    nombre: 'Suite Oceano',
    esencia: 'La suite insignia',
    descripcion: 'Descripcion de prueba.',
    precio: 890,
    tamano: 65,
    capacidad: 2,
    cama: 'King size',
    vista: 'Mar, frontal',
    idealPara: 'Aniversarios',
    amenidades: ['Terraza privada'],
    condiciones: ['Desayuno incluido'],
    fotos: [{ src: 'assets/suite-oceano.jpg', alt: 'Suite Oceano' }],
  },
];

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
        { provide: CatalogoService, useValue: { getHabitaciones: vi.fn().mockReturnValue(of(habitacionesMock)) } },
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

  it('debería cargar las habitaciones desde el catalogo', () => {
    expect(component.habitaciones().length).toBe(1);
    expect(component.habitaciones()[0].nombre).toBe('Suite Oceano');
    expect(component.fotoActiva()).toEqual([0]);
    expect(component.cargando()).toBe(false);
  });

  it('debería contener una lista de servicios incluidos', () => {
    expect(component.serviciosIncluidos.length).toBe(8);
  });
});
