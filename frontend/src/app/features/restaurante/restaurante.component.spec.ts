import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RestauranteComponent } from './restaurante.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('RestauranteComponent', () => {
  let component: RestauranteComponent;
  let fixture: ComponentFixture<RestauranteComponent>;

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
      imports: [RestauranteComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente de restaurante', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener la lista del menú de degustación con 8 platos', () => {
    expect(component.menuDegustacion.length).toBe(8);
  });

  it('debería tener la carta de vinos con 4 botellas seleccionadas', () => {
    expect(component.cartaVinos.length).toBe(4);
  });

  it('debería tener 5 imágenes de galería para mostrar', () => {
    expect(component.galeriaPlatos.length).toBe(5);
  });

  it('debería intentar desplazarse a una sección', () => {
    const mockElement = { scrollIntoView: vi.fn() };
    const getElementSpy = vi.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);

    component.desplazarA('filosofia');

    expect(getElementSpy).toHaveBeenCalledWith('filosofia');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    getElementSpy.mockRestore();
  });
});
