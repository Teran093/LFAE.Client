# LFAE.Client

Web client for **Life For All Europe (LFAE)**, an evangelical Christian ministry with churches across Europe, mainly in Portugal and Spain.

The application has two areas:

- **Public site**: lets visitors find a church, see upcoming events, give an offering, download resources and learn about the ministry.
- **Dashboard**: a private area where the ministry team manages events, churches, languages, countries and event invitation letters.

> **Status:** early development. The architecture, shared UI components and design tokens are in place. Most pages are still placeholders.

## Features

### Public site

| Page | Route | Description |
| --- | --- | --- |
| Home | `/` | Ministry landing page |
| Churches | `/churches` | Church directory with an interactive map (Leaflet) |
| Events | `/events` | Events organized by the ministry and its churches |
| Offerings | _planned_ | How to give to the ministry |
| Resources | `/resources` | Downloadable material, such as the brand identity kit |
| About Us | `/about` | The ministry's story and mission |
| CEAPE | `/ceape` | A ministry project (coming later) |
| Photo Gallery | `/photos` | Photo albums from the ministry's Google Drive |

### Dashboard (`/dashboard`)

- Event creation and management
- Management of the churches shown on the public site
- Language and country management
- Event invitation letter management

## Tech stack

- [Angular 22](https://angular.dev): standalone components, signals, zoneless change detection
- Angular SSR + Express: pages are prerendered, server-rendered or client-rendered depending on the route
- [Tailwind CSS 4](https://tailwindcss.com) with custom design tokens
- [Angular CDK](https://material.angular.dev/cdk) for overlays and accessibility
- [ng-icons](https://ng-icons.github.io/ng-icons) (Phosphor, Lucide, Tabler, Simple Icons)
- [Vitest](https://vitest.dev) for unit tests
- Backend: a separate Spring Boot REST API, served under `/api`

## Getting started

### Prerequisites

- Node.js 24 or later (the project is developed on Node 24.x)
- [pnpm](https://pnpm.io)
- The LFAE backend API running on `http://localhost:8080` (needed for data-driven pages)

### Install and run

```bash
pnpm install
pnpm start
```

Open `http://localhost:4200`. In development, requests to `/api/**` are proxied to `http://localhost:8080` (see [proxy.conf.json](proxy.conf.json)).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm start` | Start the dev server with live reload |
| `pnpm build` | Production build (browser + server) in `dist/LFAE.Client/` |
| `pnpm serve:ssr:LFAE.Client` | Run the built SSR server (default port 4000, or `PORT`) |
| `pnpm watch` | Rebuild in development mode on every change |
| `pnpm lint` | Lint TypeScript and HTML templates |
| `pnpm test` | Run unit tests with Vitest |

## Project structure

```
src/
├── app/
│   ├── core/        App-wide singletons: error handling, HTTP interceptors, services
│   ├── public/      Public site: layout (navbar) and pages
│   ├── dashboard/   Admin area: layout and pages
│   └── shared/      Reusable UI: components, directives, icons, models, utils
├── styles/          Design tokens, color roles and shared control styles
├── styles.css       Global stylesheet entry point
└── server.ts        Express server for SSR
```

## Contributing

- Use English for all code, comments and commit messages.
- Run `pnpm lint` before committing. Prettier formats the code (100-column width).
- The site serves a wide audience, from older adults to teenagers. Keep the UI simple, readable and accessible (WCAG AA), while still making it look modern.
- See [CLAUDE.md](CLAUDE.md) for detailed architecture notes and coding conventions.
