import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../dashboard/pages/dashboard-home-page/dashboard-home-page').then(
            (m) => m.DashboardHomePage,
          ),
        title: 'Home • Dashboard | LFAE',
      },
      // Dev-only playground to try the shared components; not part of the product
      {
        path: 'demo',
        loadComponent: () => import('../dashboard/pages/demo/demo').then((m) => m.Demo),
        title: 'Demo • Dashboard | LFAE',
      },
    ],
  },
];
