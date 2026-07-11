import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';
import { ClientDashboardComponent } from './client-dashboard.component';
import { ClientService } from '../../services/client.service';
import { AuthService } from '@core/services/auth.service';
import { AdminVoucher } from '@features/admin/services/admin.service';

const vouchersMock: AdminVoucher[] = [
  {
    id: 1,
    nombre: 'Prueba Panel',
    habitacion: 'suite-oceano',
    tipoComprobante: 'yape',
    monto: 450,
    codigoOperacion: 'TEST99123',
    fechaPago: '2026-07-10',
    celular: '999888777',
    archivoNombre: 'voucher.png',
    archivoTipo: 'image/png',
    estado: 'VALIDADO',
    fechaSubida: '2026-07-11T10:00:00',
    archivoUrl: '/api/v1/admin/vouchers/1/archivo',
  },
];

describe('ClientDashboardComponent', () => {
  let component: ClientDashboardComponent;
  let fixture: ComponentFixture<ClientDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDashboardComponent],
      providers: [
        provideRouter([]),
        { provide: ClientService, useValue: { getMyVouchers: vi.fn().mockReturnValue(of(vouchersMock)) } },
        {
          provide: AuthService,
          useValue: { currentUser: () => ({ name: 'Prueba Panel', email: 'prueba@puerbaria.dev', role: 'USER', token: '' }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar las reservas y calcular el resumen', () => {
    expect(component.vouchers().length).toBe(1);
    expect(component.reservasValidadas()).toBe(1);
    expect(component.reservasPendientes()).toBe(0);
    expect(component.montoValidado()).toBe(450);
  });

  it('debería saludar con el primer nombre del huésped', () => {
    expect(component.nombreHuesped()).toBe('Prueba');
  });
});
