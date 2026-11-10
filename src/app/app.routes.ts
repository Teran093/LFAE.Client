import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadChildren: () => import('./public/public.routes').then((m) => m.PUBLIC_ROUTES) },
  {
    path: 'dashboard',
    // TODO:
    // canActivate: [authGuard],
    loadChildren: () => import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
  },
];
