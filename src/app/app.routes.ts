import { Routes } from '@angular/router';

export const routes: Routes = [
  // Demo page for testing components and features. This page is not part of the main
  // application and is only used for development purposes.
  {
    path: 'demo',
    loadComponent: () => import('./public/pages/demo/demo').then((m) => m.Demo),
    title: 'Demo',
  },
];
