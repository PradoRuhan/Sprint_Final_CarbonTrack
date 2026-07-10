import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/onboarding/onboarding').then((m) => m.Onboarding),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard/producer',
    loadComponent: () =>
      import('./features/producer-dashboard/producer-dashboard').then(
        (m) => m.ProducerDashboard
      ),
    canActivate: [roleGuard(['producer'])],
  },
  {
    path: 'dashboard/admin',
    loadComponent: () =>
      import('./features/admin-dashboard/admin-dashboard').then(
        (m) => m.AdminDashboard
      ),
    canActivate: [roleGuard(['admin'])],
  },
  {
    path: '**',
    redirectTo: '',
  },
];