import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SpaWellnessComponent } from './spa-wellness.component';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
      imports: [SpaWellnessComponent, FormsModule],
      providers: [provideRouter([])],
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

  it('debería tener la lista de tratamientos', () => {
    expect(component.tratamientos.length).toBe(6);
  });

  it('debería tener la lista de instalaciones', () => {
    expect(component.instalaciones.length).toBe(4);
  });

  it('debería tener la lista de paquetes', () => {
    expect(component.paquetes.length).toBe(2);
  });

  it('debería navegar en el carrusel de tratamientos', () => {
    expect(component.indiceCarrusel()).toBe(0);
    component.carruselSiguiente();
    expect(component.indiceCarrusel()).toBe(1);
    component.carruselAnterior();
    expect(component.indiceCarrusel()).toBe(0);
    component.irACarrusel(3);
    expect(component.indiceCarrusel()).toBe(3);
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
    component.irAInstalacion(2);
    expect(component.indiceInstalacion()).toBe(2);
  });

  it('debería intentar desplazarse a una sección por ID', () => {
    const mockElement = { scrollIntoView: vi.fn() };
    const getElementSpy = vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);

    component.desplazarA('consulta');

    expect(getElementSpy).toHaveBeenCalledWith('consulta');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    getElementSpy.mockRestore();
  });

  it('debería enviar la consulta correctamente', () => {
    vi.useFakeTimers();
    component.formulario = {
      nombre: 'Test User',
      email: 'test@example.com',
      telefono: '123456789',
      interes: 'Circuito termal',
      fecha: new Date('2026-06-08'),
      mensaje: 'Hola, deseo reservar'
    };

    component.enviarConsulta();
    expect(component.enviando()).toBe(true);

    vi.advanceTimersByTime(1500);

    expect(component.enviando()).toBe(false);
    expect(component.enviado()).toBe(true);
    expect(component.formulario.nombre).toBe('');
  });
});
