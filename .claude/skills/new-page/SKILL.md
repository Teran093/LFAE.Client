---
name: new-page
description: Create a new page in LFAE.Client (public site or dashboard) with its component files, lazy route, page title and SSR render mode. Use when the user asks to add, create or scaffold a page, screen or route.
argument-hint: <page-name> [public|dashboard] [prerender|server|client]
---

# New page

Create a page named `$ARGUMENTS`.

Parse the arguments:

- **Page name** (required): kebab-case, without the `-page` suffix. For example `offerings`, `event-detail`.
- **Area**: `public` (default) or `dashboard`.
- **Render mode** (public pages only): `prerender`, `server` or `client`. If missing, choose it with the rules in step 3, and say which one you chose.

If the page name is missing, ask for it. If a page with that name already exists, stop and say so.

## 1. Component files

Create the folder `src/app/<area>/pages/<name>-page/` with three files. Follow the pattern of the existing pages exactly (see `src/app/public/pages/events-page/`):

- `<name>-page.ts`: a standalone component, selector `app-<name>-page`, class `<Name>Page` (PascalCase, no `Component` suffix), with `templateUrl` and `styleUrl`. Add a one-line JSDoc above the decorator saying what the page is for. Don't set `standalone` or `changeDetection`.
- `<name>-page.html`: a single `<h1>` with the page title, inside a `<section>`. Don't invent content, and never write doctrinal or ministry copy (see CLAUDE.md). Leave a `<!-- TODO: ... -->` describing what the page will contain.
- `<name>-page.css`: copy the content of the other pages:
  ```css
  @reference "#styles.css";
  :host {
    @apply bg-surface flex size-full flex-col;
  }
  ```

## 2. Route

Add a lazy route to the area's routes file, next to the related routes:

- **Public:** `src/app/public/public.routes.ts`, inside the `PublicLayout` children. The title is `'<Page Title> | <site name>'`, using the same site name as the other routes in that file.
- **Dashboard:** `src/app/dashboard/dashboard.routes.ts`, inside the `DashboardLayout` children. The title is `'<Page Title> • Dashboard | LFAE'`.

```ts
{
  path: '<name>',
  loadComponent: () => import('./pages/<name>-page/<name>-page').then((m) => m.<Name>Page),
  title: '...',
},
```

Use the same import path style as the neighboring routes in the file.

## 3. SSR render mode (public pages only)

Dashboard pages are already covered by `dashboard/**` in `src/app/app.routes.server.ts`, so skip this step for them.

For public pages, add an entry to `src/app/app.routes.server.ts` in the matching group, **before** the `'**'` catch-all:

- `RenderMode.Prerender`: static content that rarely changes (e.g. About Us, Offerings).
- `RenderMode.Server`: content that comes from the API and changes often (e.g. events, churches, photos).
- `RenderMode.Client`: pages that need the browser or a signed-in user.

## 4. Navigation

If the page should be reachable from the public navbar, ask before adding an `<app-nav-link>` to `src/app/public/layout/navbar/navbar.html`. Don't change the navbar without asking.

## 5. Verify

Run both checks and fix any error before finishing:

```bash
pnpm lint
npx tsc -p tsconfig.app.json --noEmit
```

## 6. Report

Tell the user, in their language:

- the files created and the files changed;
- the URL of the page (e.g. `http://localhost:4200/offerings`);
- the render mode chosen, and why;
- a suggested commit title, for example `feat(public): add offerings page`.
