import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ScrollAnimateDirective } from './scroll-animate.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <div appScrollAnimate [animationType]="'fadeIn'" [animationDelay]="100" id="test-el">Test Element</div>
  `,
  standalone: true,
  imports: [ScrollAnimateDirective],
})
class TestHostComponent {}

describe('ScrollAnimateDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    // Definimos mock global para IntersectionObserver si no existe en el entorno jsdom de testing
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
      imports: [TestHostComponent, ScrollAnimateDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('debería crear la directiva e inicializar el IntersectionObserver en el elemento host', () => {
    const debugEl = fixture.debugElement.query(By.directive(ScrollAnimateDirective));
    expect(debugEl).toBeTruthy();
    
    const element = debugEl.nativeElement as HTMLElement;
    expect(element.classList.contains('scroll-oculto')).toBe(true);
  });
});
