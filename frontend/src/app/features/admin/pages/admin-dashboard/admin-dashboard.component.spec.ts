import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminService, AdminUser } from '@features/admin/services/admin.service';
import { of, throwError } from 'rxjs';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let mockAdminService: any;

  beforeEach(async () => {
    mockAdminService = {
      getUsers: vi.fn(),
      getVouchers: vi.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        { provide: AdminService, useValue: mockAdminService },
      ],
    }).compileComponents();
  });

  const setupComponent = (usersObservable: any) => {
    mockAdminService.getUsers.mockReturnValue(usersObservable);
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('debería crear el componente de administración', () => {
    setupComponent(of([]));
    expect(component).toBeTruthy();
  });

  it('debería cargar la lista de usuarios correctamente al inicializar', () => {
    const mockUsers: AdminUser[] = [
      { id: 1, name: 'Juan Admin', email: 'admin@example.com', role: 'ADMIN' },
      { id: 2, name: 'Pedro User', email: 'user@example.com', role: 'USER' },
    ];
    
    setupComponent(of(mockUsers));

    expect(component.isLoadingUsers()).toBe(false);
    expect(component.users()).toEqual(mockUsers);
    expect(component.adminCount()).toBe(1);
    expect(component.usersErrorMessage()).toBe('');
  });

  it('debería manejar errores de conexión con el backend', () => {
    setupComponent(throwError(() => new Error('Error de conexión')));

    expect(component.isLoadingUsers()).toBe(false);
    expect(component.users()).toEqual([]);
    expect(component.adminCount()).toBe(0);
    expect(component.usersErrorMessage()).toBe('No se pudo cargar la informacion de usuarios.');
  });
});
