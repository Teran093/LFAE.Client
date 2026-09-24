import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '', // Home
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'events',
    renderMode: RenderMode.Server,
  },
  {
    path: 'churches',
    renderMode: RenderMode.Client,
  },
  {
    path: 'ceape',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'photos',
    renderMode: RenderMode.Client,
  },
  {
    path: 'resources',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'demo',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
