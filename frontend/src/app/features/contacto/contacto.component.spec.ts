import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ContactoComponent } from './contacto.component';
import { FormsModule } from '@angular/forms';

describe('ContactoComponent', () => {
  let component: ContactoComponent;
  let fixture: ComponentFixture<ContactoComponent>;

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
      imports: [ContactoComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debería crear el componente de contacto', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener la lista de asuntos con 8 opciones', () => {
    expect(component.asuntos.length).toBe(8);
  });

  it('no debería enviar el mensaje si el formulario es inválido', () => {
    component.enviarMensaje();
    expect(component.enviando()).toBe(false);
    expect(component.contactoForm.touched).toBe(true);
  });

  it('debería enviar el mensaje correctamente', () => {
    vi.useFakeTimers();
    component.contactoForm.patchValue({
      nombre: 'Cliente Especial',
      email: 'cliente@example.com',
      asunto: 'Reservas y disponibilidad',
      telefono: '999999999',
      mensaje: 'Hola, deseo cotizar una estancia del 15 al 20 de julio.'
    });

    component.enviarMensaje();
    expect(component.enviando()).toBe(true);

    vi.advanceTimersByTime(1500);

    expect(component.enviando()).toBe(false);
    expect(component.enviado()).toBe(true);
    expect(component.contactoForm.value.nombre).toBeNull();

    vi.advanceTimersByTime(6000);
    expect(component.enviado()).toBe(false);
  });
});
