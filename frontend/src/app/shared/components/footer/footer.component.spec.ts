import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { provideRouter } from '@angular/router';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debería suscribir si el email está vacío', () => {
    component.emailControl.setValue('');
    component.suscribirNewsletter();
    expect(component.newsletterEnviando()).toBe(false);
    expect(component.newsletterEnviado()).toBe(false);
  });

  it('debería simular el envío de newsletter con éxito', () => {
    vi.useFakeTimers();
    component.emailControl.setValue('test@example.com');
    component.suscribirNewsletter();

    expect(component.newsletterEnviando()).toBe(true);
    expect(component.newsletterEnviado()).toBe(false);

    // Avanza el tiempo 1.2s para simular la petición http
    vi.advanceTimersByTime(1200);

    expect(component.newsletterEnviando()).toBe(false);
    expect(component.newsletterEnviado()).toBe(true);
    expect(component.emailControl.value).toBeNull();

    // Avanza el tiempo 5s para que se limpie el mensaje de éxito
    vi.advanceTimersByTime(5000);
    expect(component.newsletterEnviado()).toBe(false);
  });
});
