import { Routes } from '@angular/router';
import { PublicLayout } from './layout/public-layout/public-layout';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('../public/pages/home-page/home-page').then((m) => m.HomePage),
        title: 'Life for All Europe',
      },
      // Main Pages
      {
        path: 'events',
        loadComponent: () =>
          import('../public/pages/events-page/events-page').then((m) => m.EventsPage),
        title: 'Events | Life for All Europe',
      },
      {
        path: 'churches',
        loadComponent: () =>
          import('../public/pages/churches-page/churches-page').then((m) => m.ChurchesPage),
        title: 'Churches | Life for All Europe',
      },
      {
        path: 'ceape',
        loadComponent: () =>
          import('../public/pages/ceape-page/ceape-page').then((m) => m.CeapePage),
        title: 'CEAPE | Life for All Europe',
      },
      {
        path: 'about',
        loadComponent: () =>
          import('../public/pages/about-us-page/about-us-page').then((m) => m.AboutUsPage),
        title: 'About Us | Life for All Europe',
      },
      {
        path: 'photos',
        loadComponent: () =>
          import('../public/pages/photo-gallery-page/photo-gallery-page').then(
            (m) => m.PhotoGalleryPage,
          ),
        title: 'Photo Gallery | Life for All Europe',
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('../public/pages/resources-page/resources-page').then((m) => m.ResourcesPage),
        title: 'Resources | Life for All Europe',
      },
    ],
  },
];
