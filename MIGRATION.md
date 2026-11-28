# Home page migration: Astro → Angular

> **Temporary file.** It only lives on the `dev-astro-angular-migration` branch. The last task
> of the checklist deletes it, together with the `@MIGRATION.md` line in `CLAUDE.md`, before
> merging into `main`.

You are migrating the **home page** of the Astro site (`lfae-website` repository) into this
Angular project. Everything in `CLAUDE.md` still applies. Where this file is more specific, it wins.

The decisions below were made by Isaac, the owner of this repository. Don't change them. If
something isn't covered here, **ask Isaac** instead of guessing.

## Sources

| What                            | Where                                                                     |
| ------------------------------- | ------------------------------------------------------------------------- |
| Home layout to reproduce        | `lfae-website/src/templates/HomeTemplate.astro`                           |
| Live version (visual reference) | https://lfae-website.jvcm1598.workers.dev/es/                             |
| Original English home text      | `lfae-website/docs/audit/pages/home/content.md`                           |
| Data                            | `lfae-website/src/content/{churches,events,programs}/*.yaml`              |
| UI strings (PT/ES only)         | `lfae-website/src/i18n/ui/es.ts`, keys `page.home.*`                      |
| Card components                 | `lfae-website/src/components/ui/{ChurchCard,EventCard,ProgramCard}.astro` |
| Section header                  | `lfae-website/src/components/sections/SectionHeader.astro`                |

## Decisions

### Scope

1. **Only the home page.** Keep the existing navbar. Don't migrate the footer, other pages, the
   mobile menu or the language switcher.
2. **Don't copy the Astro infrastructure:** Cloudflare Worker, CSP, sitemap, contact form, ICS
   calendars, JSON-LD, `scripts/`.

### Styles

3. **Use this project's styles only:** `src/styles/token.css`, `roles.css`, `controls.css`,
   `typography.css`, `VariantBase` and Tailwind utilities. **Don't** use the Astro `tokens.css`,
   its fonts (Outfit, Source Sans 3, Caveat Brush) or the "LFA 2026 ID (proposal)" brand kit.
   None of them is official, and this project's styles take priority.
4. Reproduce the Astro **layout** (sections, order, hierarchy, spacing rhythm), not its colors
   or fonts. Suggested mapping:

   | Astro                                                      | Here                                                                  |
   | ---------------------------------------------------------- | --------------------------------------------------------------------- |
   | `--color-navy` / `surface-inverse`                         | `bg-primary` + `text-surface`                                         |
   | `--color-gold` (accent on navy)                            | `tertiary`                                                            |
   | `--color-bg` / `--color-bg-alt` (white / mist bands)       | alternate `bg-surface` and `bg-white`                                 |
   | `--color-text-muted`                                       | `text-ink` with opacity, only if contrast stays ≥ 4.5:1               |
   | `--font-display` / `--font-body`                           | `font-display` (Manrope) / `font-sans` (Fira Sans)                    |
   | `--font-accent` (Caveat Brush)                             | `font-display`; there is no accent font here                          |
   | `Button` variants `accent`, `secondary`, `outline-inverse` | `variant="tertiary"`, `"secondary"`, `"surface"` + `[outline]="true"` |

5. **Don't add new colors or fonts.** If no existing token fits, stop and ask Isaac.
6. **Component CSS budget is 4 kB** (error at 8 kB). Prefer Tailwind utilities in the template,
   and split the home into one component per section.

### Language and text

7. **English only**, the future default language. There is no i18n system yet: write the
   strings in the templates and mark each one with `<!-- TODO: i18n -->` (or `// TODO: i18n`
   in TS), so they can be extracted later.
8. Where the text comes from:
   - **Hero, mission, vision and "Join us":** copy the original English **verbatim** from
     `docs/audit/pages/home/content.md`.
   - **UI strings** (section titles, buttons, empty states): translate the `page.home.*` keys
     from `es.ts` into plain English.
   - **Never write doctrinal or ministry copy yourself** (see "Content rule" in `CLAUDE.md`). If
     a text is missing, leave a visible placeholder and a `TODO`.

### Data

9. There is no API for churches, events or programs yet. Create:
   - interfaces in `src/app/core/models/` (`church.ts`, `ministry-event.ts`, `program.ts`),
     shaped like the YAML fields (English only: drop the `pt`/`es` maps);
   - services in `src/app/core/services/` (`ChurchService`, `EventService`, `ProgramService`,
     with `@Service()`), exposing the data as signals from typed static arrays, with
     `// TODO: replace with the API (httpResource)`.

   Components only talk to the services, so swapping in the API later doesn't touch them.

10. Skip entries with `sample: true`. `EventService` exposes the **upcoming** events only,
    computed in the service, never with `new Date()` in a template. The home shows the next 3
    and hides the whole section when there are none.
11. **The home renders with `RenderMode.Server`** (already set in `app.routes.server.ts`), so
    the upcoming events are fresh on every request. Don't switch it back to `Prerender`.

### Components and assets

12. Put the section components in `src/app/public/pages/home-page/sections/` (`home-hero`,
    `home-churches`, `home-events`, `home-mission`, `home-programs`, `home-resources`,
    `home-give`). Put reusable cards in `src/app/shared/components/`.
13. **Links styled as buttons:** `app-button` renders a `<button>`, but the hero and section
    CTAs are navigation links. Create `app-button-link` in `shared/components/`. It renders
    `<a routerLink>` for routes and `<a href target="_blank" rel="noopener noreferrer">` for
    external URLs, extends `VariantBase` with prefix `ctrl`, and reuses `buildVariantClasses`.
    Don't modify `app-button`.
14. **Brand images** (current identity, already optimized) are in `public/images/brand/`:
    - `lfae-logo-horizontal-white.webp` (341×80, already used by both navbars);
    - `lfae-crown-white.webp` and `lfae-crown-navy.webp` (1024×613). The hero watermark crown
      uses one of these with `NgOptimizedImage`, `alt=""` and low opacity.
15. **No photos of people.** The Astro home has none either.
16. **Scrolling:** the app fills the window and `body` doesn't scroll. The home page host must
    scroll itself (`overflow-y-auto`).
17. Link to routes that don't exist yet anyway (`/churches`, `/events`, `/resources`, and
    `/offerings` for the give band); they will be built later.

## Checklist

Work **one section per commit**, in this order. Use Conventional Commits in English, e.g.
`feat(home): add hero section`.

- [ ] 1. `app-button-link` component
- [ ] 2. Models, data and services (churches, events, programs)
- [ ] 3. Hero (title, intro, two CTAs, watermark crown)
- [ ] 4. Churches (section header + church cards)
- [ ] 5. Next events (hidden when empty)
- [ ] 6. Mission and vision
- [ ] 7. Programs
- [ ] 8. Resources band
- [ ] 9. Give band
- [ ] 10. Final review: responsive at 360px, 768px and 1280px; keyboard navigation; AXE
- [ ] 11. **Delete this file and the `@MIGRATION.md` line in `CLAUDE.md`**, then open the PR

## Done means (for every step)

1. `pnpm lint` passes.
2. `npx tsc -p tsconfig.app.json --noEmit` passes.
3. `pnpm build` passes, with no budget errors.
4. With `pnpm start` running, take a Playwright screenshot of the section and compare it with
   the live Astro version. Same structure, this project's styles.
5. Tick the item in the checklist above, in the same commit.
