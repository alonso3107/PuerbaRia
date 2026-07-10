import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'habitaciones',
    loadComponent: () =>
      import('@features/rooms/rooms.component').then((m) => m.RoomsComponent),
  },
  {
    path: 'restaurante',
    loadComponent: () =>
      import('@features/restaurante/restaurante.component').then((m) => m.RestauranteComponent),
  },
  {
    path: 'spa-wellness',
    loadComponent: () =>
      import('@features/spa-wellness/spa-wellness.component').then((m) => m.SpaWellnessComponent),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('@features/contacto/contacto.component').then((m) => m.ContactoComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@features/auth/pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@features/auth/pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'subir-voucher',
    loadComponent: () =>
      import('@features/voucher/pages/upload-voucher/upload-voucher.component').then((m) => m.UploadVoucherComponent),
  },
  {
    path: 'mis-reservas',
    loadComponent: () =>
      import('@features/client/pages/client-dashboard/client-dashboard.component').then((m) => m.ClientDashboardComponent),
  },
  {
    path: 'admin/dashboard',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('@features/admin/pages/admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
