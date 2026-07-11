import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { SpaWellnessComponent } from './spa-wellness.component';
import { CatalogoService, PaqueteSpa, TratamientoSpa } from '@core/services/catalogo.service';
import { provideRouter } from '@angular/router';

const tratamientosMock: TratamientoSpa[] = [
  { id: 1, icono: 'pi-heart', nombre: 'Masaje Balinés', descripcion: 'Descripcion.', duracion: '75 min', precio: 320 },
  { id: 2, icono: 'pi-star', nombre: 'Facial Luminosidad', descripcion: 'Descripcion.', duracion: '60 min', precio: 280 },
];

const paquetesMock: PaqueteSpa[] = [
  {
    id: 1,
    etiqueta: 'El más pedido',
    nombre: 'Escapada Renovadora',
    descripcion: 'Descripcion.',
    imagen: 'assets/spa/masaje-aceites.jpg',
    duracion: '4 horas',
    precio: 750,
    incluye: ['Masaje Balinés de 75 minutos'],
  },
];

describe('SpaWellnessComponent', () => {
  let component: SpaWellnessComponent;
  let fixture: ComponentFixture<SpaWellnessComponent>;

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
      imports: [SpaWellnessComponent],
      providers: [
        provideRouter([]),
        {
          provide: CatalogoService,
          useValue: {
            getTratamientos: vi.fn().mockReturnValue(of(tratamientosMock)),
            getPaquetes: vi.fn().mockReturnValue(of(paquetesMock)),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaWellnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debería crear el componente de spa-wellness', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar tratamientos y paquetes desde el catalogo', () => {
    expect(component.tratamientos().length).toBe(2);
    expect(component.paquetes().length).toBe(1);
    expect(component.cargando()).toBe(false);
    expect(component.errorCarga()).toBe(false);
  });

  it('debería tener la lista de instalaciones', () => {
    expect(component.instalaciones.length).toBe(4);
  });

  it('debería navegar en las instalaciones (carrusel magazine)', () => {
    expect(component.indiceInstalacion()).toBe(0);
    component.instalacionSiguiente();
    expect(component.indiceInstalacion()).toBe(1);
    component.instalacionAnterior();
    expect(component.indiceInstalacion()).toBe(0);
    component.instalacionAnterior(); // Debería ir al último
    expect(component.indiceInstalacion()).toBe(component.instalaciones.length - 1);
    component.instalacionSiguiente(); // Debería volver a 0
    expect(component.indiceInstalacion()).toBe(0);
  });

  it('debería intentar desplazarse a una sección por ID', () => {
    const mockElement = { scrollIntoView: vi.fn() };
    const getElementSpy = vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);

    component.desplazarA('consulta');

    expect(getElementSpy).toHaveBeenCalledWith('consulta');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    getElementSpy.mockRestore();
  });

  it('no debería enviar la consulta si el formulario es inválido', () => {
    component.enviarConsulta();
    expect(component.enviando()).toBe(false);
    expect(component.consultaForm.touched).toBe(true);
  });

  it('debería enviar la consulta correctamente', () => {
    vi.useFakeTimers();
    component.consultaForm.setValue({
      nombre: 'Test User',
      email: 'test@example.com',
      telefono: '123456789',
      interes: 'Circuito termal',
      fecha: new Date('2026-06-08'),
      mensaje: 'Hola, deseo reservar',
    });

    component.enviarConsulta();
    expect(component.enviando()).toBe(true);

    vi.advanceTimersByTime(1500);

    expect(component.enviando()).toBe(false);
    expect(component.enviado()).toBe(true);
    expect(component.consultaForm.value.nombre).toBeNull();
  });
});
