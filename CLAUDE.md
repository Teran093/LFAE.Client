# LFAE.Client

Angular 22 front end for **Life For All Europe (LFAE)**. It uses SSR with hydration (`@angular/ssr` + Express), Tailwind CSS v4, Angular CDK and `@ng-icons`. The backend is a separate Spring Boot API, reached through `/api/**`.

## Product context

Life For All Europe (LFAE) is an evangelical Christian ministry with churches in several European countries, mainly Portugal and Spain. The site has two areas: a public website and a private dashboard where the ministry manages the content shown on it.

### Identity

- **Who they are:** a Christian communication channel that spreads the Gospel of the Kingdom of God through digital platforms, social media and in-person gatherings. Visitors are invited to the ministry's events and to the gatherings of its churches across Europe.
- **Mission:** to fulfill Matthew 24:14 by spreading the Gospel of the Kingdom throughout the world as a testimony to all nations.
- **Vision:** to become an effective communication channel that spreads the pure Word of God through social media and digital platforms.
- **Core values:** Love, Enthusiasm, Excellence, Inclusion, Commitment.
- **Channels:** Instagram, YouTube and Spotify, which publish daily spiritual content. Inviting visitors to subscribe is a recurring call to action.
- **Contact:** staff@lifeforall-europe.org. A common goal of a visitor is to get connected with a local church community in their city.
- **Tone:** welcoming, inclusive, community-oriented and Christ-centered. Typical imagery shows young people reading devotionals together, messages given at the European Conference, and members embracing.
- **Content rule:** never write doctrinal or theological copy (statement of faith, Bible interpretations, the ministry's descriptions of itself). The ministry provides this text. Use clearly marked placeholders until it does.

### Planned scope

Public area (`public/`, routes under `/`):

| Page          | Route           | Purpose                                                                 |
| ------------- | --------------- | ----------------------------------------------------------------------- |
| Home          | `/`             | Landing page for the ministry.                                          |
| Churches      | `/churches`     | List of the ministry's churches with an interactive **Leaflet** map.    |
| Events        | `/events`       | Ministry events (rarely, events of a single church).                    |
| Offerings     | not created yet | How to give or donate to the ministry.                                  |
| Resources     | `/resources`    | Downloadable material, such as the ministry's brand identity.           |
| About Us      | `/about`        | Who the ministry is.                                                    |
| CEAPE         | `/ceape`        | A ministry project. Out of scope for now: don't build it unless asked.  |
| Photo Gallery | `/photos`       | Photos organized in folders that come from the ministry's Google Drive. |

Dashboard (`dashboard/`, routes under `/dashboard`, auth required):

- Create and manage events.
- Create and manage the churches shown on the public site.
- Manage languages and countries.
- Manage the invitation letters for events.

Current status: every public page is an empty stub, and the dashboard only has a home page. The Offerings page and route don't exist yet. Leaflet isn't installed yet. Only the languages API (`LanguageService`) is wired up. The domain names used in code and the API are in English (`event`, `church`, `language`, `country`, `invitationLetter`, `offering`).

### Audience and design direction

The site has to work for older adults, who visit and use it most, while also appealing to the teenagers and young people the church is now focused on. Aim for a balance: **simple to use, but modern and eye-catching**.

- Readable first: generous font sizes (body text at least 16px), strong contrast (WCAG AA as a minimum), clear headings and plenty of spacing.
- Obvious navigation: few top-level items, descriptive labels, large click and tap targets, and no actions hidden behind hover-only or gesture-only interactions.
- Modern feel: bold photography, the brand tokens in `token.css`, subtle transitions, and a polished mobile layout. Respect `prefers-reduced-motion`, and never let visual effects hurt readability.
- The tone is warm and welcoming, contemporary but not trendy for its own sake. The ministry is evangelical and somewhat modern, but not edgy.
- The site is multilingual (Portuguese, Spanish, English, French, German, Italian). Keep UI strings ready for translation, and avoid layouts that break with longer text.

## Commands

Package manager is **pnpm** (`packageManager: pnpm@12`).

- `pnpm start`: dev server on http://localhost:4200. The dev configuration uses [proxy.conf.json](proxy.conf.json) to forward `/api/**` to `http://localhost:8080` (the backend must be running there).
- `pnpm build`: production build to `dist/LFAE.Client/` (browser + server bundles).
- `pnpm serve:ssr:LFAE.Client`: run the built SSR server (port `PORT` or 4000).
- `pnpm lint`: ESLint over `src/**/*.ts` and `src/**/*.html`.
- `pnpm test`: Vitest through `@angular/build:unit-test` (jsdom). There are no spec files yet; schematics are set to `skipTests: true`.
- `start:lan` and `build:test` call configurations `lan` and `test`, which do **not** exist in [angular.json](angular.json) yet. They fail until those configurations are added.

Production budgets: initial bundle 500kB warning / 1MB error; **component styles 4kB warning / 8kB error**. Put shared styles in `src/styles/`, not in component CSS.

## Architecture

```
src/
  main.ts / main.server.ts / server.ts   browser bootstrap, server bootstrap, Express SSR server
  app/
    app.config.ts            router, hydration, HttpClient + errorInterceptor, GlobalErrorHandler
    app.config.server.ts     merges server rendering + serverRoutes
    app.routes.ts            '' -> public/public.routes, 'dashboard' -> dashboard/dashboard.routes (lazy)
    app.routes.server.ts     per-route render mode (Prerender / Server / Client)
    core/                    app-wide singletons: errors/, interceptors/, services/ (+ guards/, models/ by schematic)
    public/                  public site: layout/ (PublicLayout, Navbar) + pages/*-page
    dashboard/               private area: layout/ (DashboardLayout, DashboardNavbar) + pages/
    shared/                  reusable UI: components/, directives/, bases/, models/, services/, utils/, icons/
  styles.css + styles/       global Tailwind layers and design tokens
```

### Routing and rendering

- Feature areas expose a `*_ROUTES` const (`PUBLIC_ROUTES`, `DASHBOARD_ROUTES`) with a layout component and lazily loaded child pages (`loadComponent`). Every route sets a `title` (`"<Page> | Life For All Europe"`, or `"<Page> • Dashboard | LFAE"`).
- **When you add a route, also add it to [app.routes.server.ts](src/app/app.routes.server.ts)**: `Prerender` for static pages, `Server` for pages whose content comes from the API, `Client` for the dashboard and auth-only pages.
- `/demo` is a dev-only playground for shared components. It is not part of the product.
- The dashboard `authGuard` is still a TODO in [app.routes.ts](src/app/app.routes.ts).

### SSR caveats

Code runs on the server too. Guard browser-only APIs (`window`, `document`, `alert`, DOM measurement) with `isPlatformBrowser(PLATFORM_ID)` or `afterRenderEffect`/`afterNextRender`. For example, `IconDirective` renders only in `afterRenderEffect`, and `NotificationService` falls back to `console.error` on the server.

### Error handling

- [error.interceptor.ts](src/app/core/interceptors/error.interceptor.ts) turns every `HttpErrorResponse` into an `AppError` ([app-error.ts](src/app/core/errors/app-error.ts)). It reads Spring Boot `ProblemDetail` bodies (`code`, `detail`, `fieldErrors`), falls back to HTTP status codes, and uses `NETWORK_ERROR` for status 0.
- [GlobalErrorHandler](src/app/core/errors/global-error-handler.ts) logs through `LoggerService` and notifies through `NotificationService`, skipping errors already `markAsHandled()`. If a component handles an `AppError` itself, call `markAsHandled()` so the user isn't notified twice.
- To add an error code, map it in `ERROR_I18N_KEYS`. i18n and toasts are still mocks (`alert` + hard-coded strings in `NotificationService`).

### Data access

Services use `httpResource` for reads and `HttpClient` for writes, then call `.reload()` on the resource. [language.service.ts](src/app/shared/services/language.service.ts) is the reference pattern. API URLs are relative (`/api/...`). New singleton services use `@Service()` from `@angular/core`.

### Shared UI system

- **Variant components** (`app-button`, `app-select`, `app-checkbox`, …) extend [VariantBase](src/app/shared/bases/variant-base.ts). It provides the `disabled`, `variant` (`primary|secondary|tertiary|surface`), `size`, `rounded` and `outline` inputs, plus `iconSize`. Build class lists with `buildVariantClasses({ ...this.variantConfig(), prefix: this.prefix, ... })` from [style-variants.ts](src/app/shared/utils/style-variants.ts). This yields `{prefix}-base role-{style} [{prefix}-outline] {prefix}-size-{size} rounded-*`.
- **Styling layers** (imported in order in [styles.css](src/styles.css)): `token.css` (Tailwind `@theme` colors and fonts; Manrope = `font-display`, Fira Sans = `font-sans`), `base`, `typography`, `components`, `utilities`, `roles.css` (`.role-*` classes set `--role-bg/-text/-border/-accent/...`), `controls.css` (`.ctrl-*` styles for button-like controls). To add a color role, add one block to `roles.css`; components read only `--role-*` variables.
- **Color roles and contrast:** every role meets WCAG AA (4.5:1) for its text. `surface` is a light control for dark backgrounds (navy navbar, hero), not for light pages. Gold: `tertiary` passes AA as a background for light text and as text on light backgrounds; `tertiary-light` is for decoration only (lines, icons, highlights), never for text or controls.
- **Icons**: use `<span appIcon="name" [size]="16"></span>` ([icon.directive.ts](src/app/shared/directives/icon.directive.ts)). Library icons must be registered in [ng-icon-list.ts](src/app/shared/models/ng-icon-list.ts) (Phosphor, Lucide, Tabler, Simple Icons). Custom SVGs go in `shared/icons/`, imported as text in [custom-icon-list.ts](src/app/shared/models/custom-icon-list.ts) (esbuild `.svg` loader plus [svg.d.ts](src/svg.d.ts)). SVGs should use `currentColor`.
- **Overlays**: `[appOverlay]="templateRef"` ([overlay.directive.ts](src/app/shared/directives/overlay.directive.ts)) wraps CDK Overlay for menus, selects and popovers. It supports click or hover, positioning, Escape/outside-click close, focus return and enter/leave transitions.

### Conventions

- The CLI schematics put files in fixed places: components in `shared/components`, services, guards, interceptors and models in `core/`, directives and pipes in `shared/`. Page and layout components go under their feature folder (`public/`, `dashboard/`). Filenames have no `.component` suffix (`button.ts`, class `Button`). Components use external `.html`/`.css` files.
- Selector prefix is `app`: elements use kebab-case, directives use camelCase attributes.
- ESLint enforces explicit member accessibility (`public`/`protected`/`private` on every member), `member-ordering` (fields → constructor → methods), `curly`, and the Angular template accessibility rules.
- Prettier: `printWidth: 100`, Angular parser for HTML.
- All code comments, JSDoc and UI text MUST be in English, even when the conversation with the developer is in another language.

### Comments

Comments MUST be short and concise: one line in most cases. The reader to write for is a junior developer with about one year of experience.

- Explain **why** or **what for**, not what the code literally does. `// Increment i` is noise; `// Clicks inside the menu are not "outside clicks", so close it manually` is useful.
- Add a one-line `/** ... */` to every exported class, service, directive and component, and to inputs, outputs and public methods whose purpose isn't obvious from the name.
- Don't comment obvious code, and don't repeat the type or the name.
- **Exception:** a longer comment (a few lines) is allowed only when the code would confuse that junior developer: timing tricks (`requestAnimationFrame`, forced reflows), SSR or browser-only workarounds, CDK internals, or non-obvious business rules. Even then, keep it as short as it can be.
- When code changes, update or delete the comment that describes it. A wrong comment is worse than none.
- Format TODOs as `// TODO: <what is missing>`.

---

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
