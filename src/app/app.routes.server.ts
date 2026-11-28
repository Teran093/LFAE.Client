import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Public pages that are mostly static and can be prerendered
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: 'ceape', renderMode: RenderMode.Prerender },

  // Public pages whose content comes from the API and changes frequently
  // Home shows the upcoming events, which a prerendered page would freeze at build time
  { path: '', renderMode: RenderMode.Server },
  { path: 'events', renderMode: RenderMode.Server },
  { path: 'churches', renderMode: RenderMode.Server },
  { path: 'resources', renderMode: RenderMode.Server },
  { path: 'photos', renderMode: RenderMode.Server },

  // Private pages that require authentication and are mostly dynamic
  { path: 'dashboard/**', renderMode: RenderMode.Client },
  { path: 'demo', renderMode: RenderMode.Client },

  // Any other route (includes the 404)
  { path: '**', renderMode: RenderMode.Server },
];
