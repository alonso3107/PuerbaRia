import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UploadVoucherComponent } from './upload-voucher.component';
import { VoucherService } from '@features/voucher/services/voucher.service';
import { of, throwError } from 'rxjs';

describe('UploadVoucherComponent', () => {
  let component: UploadVoucherComponent;
  let fixture: ComponentFixture<UploadVoucherComponent>;
  let mockVoucherService: any;

  beforeEach(async () => {
    mockVoucherService = {
      enviarVoucher: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UploadVoucherComponent, RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: VoucherService, useValue: mockVoucherService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente de subida de voucher', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar en el paso 1', () => {
    expect(component.pasoActual()).toBe(1);
    expect(component.formulario.valid).toBe(false);
  });

  it('no debería avanzar de paso si el paso actual es inválido', () => {
    component.pasoSiguiente();
    expect(component.pasoActual()).toBe(1); // Se queda en el paso 1
  });

  it('debería avanzar al paso 2 si el paso 1 es válido', () => {
    component.formulario.get('nombre')?.setValue('Alonso Flores');
    component.formulario.get('habitacion')?.setValue('suite-oceano');
    
    component.pasoSiguiente();
    
    expect(component.pasoActual()).toBe(2);
    expect(component.maximoPasoAlcanzado()).toBe(2);
  });

  it('debería permitir regresar al paso 1 desde el paso 2', () => {
    component.formulario.get('nombre')?.setValue('Alonso Flores');
    component.formulario.get('habitacion')?.setValue('suite-oceano');
    component.pasoSiguiente(); // Avanza a 2
    
    component.pasoAnterior();
    
    expect(component.pasoActual()).toBe(1);
  });

  it('debería avanzar al paso 3 si los pasos anteriores son válidos', () => {
    component.formulario.get('nombre')?.setValue('Alonso Flores');
    component.formulario.get('habitacion')?.setValue('suite-oceano');
    component.pasoSiguiente(); // Paso 2
    
    component.formulario.get('tipoComprobante')?.setValue('yape');
    component.formulario.get('monto')?.setValue(250.50);
    component.formulario.get('codigoOperacion')?.setValue('123456');
    component.formulario.get('fechaPago')?.setValue('2026-06-08');
    component.pasoSiguiente(); // Paso 3
    
    expect(component.pasoActual()).toBe(3);
  });

  it('debería procesar correctamente la selección de un archivo de imagen', () => {
    const file = new File(['image-data'], 'voucher.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
    
    component.onArchivoSeleccionado(event);
    
    expect(component.archivoSeleccionado()).toBe(file);
    expect(component.formulario.get('voucher')?.value).toBe(file);
  });

  it('debería rechazar archivos con tipos no permitidos', () => {
    const file = new File(['text-data'], 'voucher.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } };
    
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    component.onArchivoSeleccionado(event);
    
    expect(component.archivoSeleccionado()).toBeNull();
    expect(alertSpy).toHaveBeenCalledWith('Tipo de archivo no permitido. Solo JPG, PNG, WEBP o PDF.');
    alertSpy.mockRestore();
  });

  it('debería remover el archivo seleccionado', () => {
    const file = new File(['image-data'], 'voucher.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
    component.onArchivoSeleccionado(event);
    
    component.removerArchivo();
    
    expect(component.archivoSeleccionado()).toBeNull();
    expect(component.vistaPrevia()).toBeNull();
    expect(component.formulario.get('voucher')?.value).toBeNull();
  });

  it('debería enviar correctamente el voucher al backend en el paso 3', () => {
    // Rellenamos todo el formulario
    component.formulario.get('nombre')?.setValue('Alonso Flores');
    component.formulario.get('habitacion')?.setValue('suite-oceano');
    component.formulario.get('tipoComprobante')?.setValue('yape');
    component.formulario.get('monto')?.setValue(250.50);
    component.formulario.get('codigoOperacion')?.setValue('123456');
    component.formulario.get('fechaPago')?.setValue('2026-06-08');
    component.formulario.get('celular')?.setValue('987654321');
    component.formulario.get('aceptaTerminos')?.setValue(true);

    const file = new File(['image-data'], 'voucher.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
    component.onArchivoSeleccionado(event);

    mockVoucherService.enviarVoucher.mockReturnValue(of({ mensaje: 'Subida exitosa', id: 1, estado: 'PROCESANDO' }));

    component.onSubmit();

    expect(component.cargando()).toBe(false);
    expect(component.enviado()).toBe(true);
    expect(mockVoucherService.enviarVoucher).toHaveBeenCalled();
  });

  it('debería manejar errores del servidor al enviar el voucher', () => {
    component.formulario.get('nombre')?.setValue('Alonso Flores');
    component.formulario.get('habitacion')?.setValue('suite-oceano');
    component.formulario.get('tipoComprobante')?.setValue('yape');
    component.formulario.get('monto')?.setValue(250.50);
    component.formulario.get('codigoOperacion')?.setValue('123456');
    component.formulario.get('fechaPago')?.setValue('2026-06-08');
    component.formulario.get('celular')?.setValue('987654321');
    component.formulario.get('aceptaTerminos')?.setValue(true);

    const file = new File(['image-data'], 'voucher.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
    component.onArchivoSeleccionado(event);

    const errorMsg = 'Error interno del servidor.';
    mockVoucherService.enviarVoucher.mockReturnValue(throwError(() => new Error(errorMsg)));

    component.onSubmit();

    expect(component.cargando()).toBe(false);
    expect(component.enviado()).toBe(false);
    expect(component.mensajeError()).toBe(errorMsg);
  });

  it('debería restablecer el estado al llamar a reiniciar()', () => {
    component.formulario.get('nombre')?.setValue('Alonso Flores');
    component.pasoActual.set(2);
    component.enviado.set(true);
    
    component.reiniciar();
    
    expect(component.pasoActual()).toBe(1);
    expect(component.enviado()).toBe(false);
    expect(component.formulario.get('nombre')?.value).toBeNull();
  });
});
