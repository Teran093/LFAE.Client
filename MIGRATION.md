# Home page migration: Astro → Angular

> **Temporary file.** It only lives on the `dev-astro-angular-migration` branch. The last task
> of the checklist deletes it, together with the `@MIGRATION.md` line in `CLAUDE.md`, before
> merging into `main`.

You are building the **home page** of this Angular project, using the Astro site
(`lfae-website` repository) as a starting point. It is **not a 1:1 copy**: Isaac, the owner of
this repository, reviewed the Astro home and decided what to keep, drop and redesign. Everything
in `CLAUDE.md` still applies. Where this file is more specific, it wins.

Don't change these decisions. If something isn't covered here, **ask Isaac** instead of guessing.

## Sources

| What                                  | Where                                            |
| ------------------------------------- | ------------------------------------------------ |
| Astro home (structure reference only) | `lfae-website/src/templates/HomeTemplate.astro`  |
| Live Astro version                    | https://lfae-website.jvcm1598.workers.dev/es/    |
| Original English home text            | `lfae-website/docs/audit/pages/home/content.md`  |
| Event data                            | `lfae-website/src/content/events/*.yaml`         |
| Event card reference                  | `lfae-website/src/components/ui/EventCard.astro` |
| Photos (already optimized)            | `public/images/home/`, `public/images/events/`   |
| Brand images                          | `public/images/brand/`                           |

## Concept

**"The words that light up."** The ministry's own line is _"The place to find the words that
make you feel the presence of God"_. The page's one memorable moment comes from it: as the
visitor scrolls, the words of Matthew 24:14 light up one by one. Everything else stays calm and
lets **real photos of people** carry the emotion. It's a church: faces, embraces and worship
matter more than decoration.

Isaac wants to try this concept before confirming it. Build the mission section early (step 4
of the checklist) so he can review it.

## Decisions

### Scope

1. **Only the home page.** Keep the existing navbar. Don't migrate the footer, other pages, the
   mobile menu or the language switcher.
2. **Don't copy the Astro infrastructure:** Cloudflare Worker, CSP, sitemap, contact form, ICS
   calendars, JSON-LD, `scripts/`.
3. **No churches list on the home.** Isaac rejected it. The hero button "Find a church" links to
   `/churches` instead.

### Section order

```
1. Hero        full-bleed worship photo, navy overlay, headline, 2 buttons, crown
2. Mission     "Our mission is…" + Matthew 24:14, large and centered   ← signature moment
3. Vision      vision + the five values, next to a photo of young people reading
4. Events      upcoming events carousel (hidden when there are none)
5. Join us     collage of 2–3 photos with depth + text + About us button
6. Programs    Immersion (featured) and CEAPE
7. Resources   simple band
8. Give        navy band with the crown
```

Left-aligned text everywhere (easier to read for older visitors), except the verse in the
mission section, which is centered like a quotation.

### Styles

4. **Use this project's styles only:** `token.css`, `roles.css`, `controls.css`,
   `typography.css`, `VariantBase` and Tailwind utilities. **Don't** use the Astro `tokens.css`,
   its fonts (Outfit, Source Sans 3, Caveat Brush) or the "LFA 2026 ID (proposal)" brand kit.
   None of them is official, and this project's styles take priority.
5. Navy `primary` is the background of the strong moments (hero, give). Gold `tertiary` is an
   accent only, never text on white. Alternate `bg-surface` and `bg-white` for the other bands.
6. **Don't add new colors or fonts.** If no existing token fits, stop and ask Isaac.
7. **Avoid the generic look of the Astro version** (the `frontend-design` skill explains why):
   - no identical bordered cards for everything: cards only where the content is a real
     collection (events, programs);
   - no `·` middle-dot meta strings ("Madrid · España") and no `→` arrows on links;
   - no single word in a different font (the Astro "Juntos").
8. **Component CSS budget is 4 kB** (error at 8 kB). Prefer Tailwind utilities in templates.

### Text

9. **English only**, the future default language. There is no i18n system yet: write the
   strings in the templates and mark each one with `<!-- TODO: i18n -->` (or `// TODO: i18n`
   in TS).
10. **Never write doctrinal or ministry copy yourself** (see "Content rule" in `CLAUDE.md`). Use
    exactly these texts:

| Section   | Text                                                                                                                                                                                                                                                                                                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero      | Heading: _The place to find the words that make you feel the presence of God_ · Intro: _Follow the path of God_ · Buttons: _Find a church_ (`/churches`), _Upcoming events_ (`/events`)                                                                                                                                                                                               |
| Mission   | _Our mission is to fulfil what Jesus laid down in His Word:_ · Quote: _"And this gospel of the kingdom shall be preached in all the world for a witness unto all nations; and then shall the end come."_ · Citation: _Matthew 24:14_                                                                                                                                                  |
| Vision    | _Our vision is to disseminate the pure Word of God to every corner of the earth._ · _Our values are love, enthusiasm, excellence, inclusion and commitment in the service of God._ (all **five** values: Isaac's decision)                                                                                                                                                            |
| Events    | Heading: _Upcoming events_ · Link: _See all events_ (`/events`)                                                                                                                                                                                                                                                                                                                       |
| Join us   | Heading: _Join us in sharing God's love and transforming lives across Europe._ · _Curious to know more about who we are and what we stand for? Learn about our story, our values, and the vision God has placed in our hearts._ · Button: _About us_ (`/about`)                                                                                                                       |
| Programs  | Heading: _Training and tools_ · **Immersion:** _Daily devotionals by Pedro Dong_ + link _Read the devotionals_ to https://oquetemosvistoeouvido.com.br/category/imersao/imersao-ingles/ (external, new tab). **No description**: the real texts aren't available yet · **CEAPE:** _Missionary training in Torres Vedras, Portugal, since 1998._ + link _Learn about CEAPE_ (`/ceape`) |
| Resources | Heading: _Resources for churches_ · _Hymns and lyrics, visual identity and conference materials, ready to use._ · Button: _See resources_ (`/resources`)                                                                                                                                                                                                                              |
| Give      | Heading: _Support this work_ · _Your offering helps us preach the gospel and care for the churches across Europe._ · Button: **_Give_** (`/offerings`)                                                                                                                                                                                                                                |

11. The donation button is called **Give** across the whole site (the navbar already uses it).
    Never "Donate" or "Offer".
12. The Astro version describes Immersion as an English-language immersion programme. **That's
    wrong**: Immersion is a page with short daily devotionals, one per weekday, by the ministry's
    leader, Pedro Dong. Don't copy the Astro Immersion text.

### Data

13. There is no API for events yet. Create:
    - `src/app/core/models/ministry-event.ts`, shaped like the Astro event YAML (English only:
      drop the `pt`/`es` maps). Use `image` (a path in `public/images/events/`) instead of
      `artwork`;
    - `src/app/core/services/event.service.ts` (`@Service()`), exposing the **upcoming** events as
      a signal from a typed static array, with `// TODO: replace with the API (httpResource)`.
      Compute "upcoming" in the service, never with `new Date()` in a template. Skip
      `sample: true` entries.
14. Programs (Immersion, CEAPE) are fixed content: keep them in the programs section component,
    not in a service.
15. **The home renders with `RenderMode.Server`** (already set in `app.routes.server.ts`), so the
    upcoming events are fresh on every request. Don't switch it back to `Prerender`.

### Components

16. Structure:

```
src/app/public/pages/home-page/
  home-page.ts             composes the sections; its host scrolls (overflow-y-auto)
  sections/
    home-hero/  home-mission/  home-vision/  home-events/
    home-join/  home-programs/  home-resources/  home-give/
src/app/shared/components/
  button-link/             links styled as buttons
  carousel/                Embla + accessible previous/next buttons (the gallery will reuse it)
  event-card/
```

17. **`app-button-link`:** `app-button` renders a `<button>`, but the CTAs are navigation links.
    It renders `<a routerLink>` for routes and `<a href target="_blank" rel="noopener noreferrer">`
    for external URLs, extends `VariantBase` with prefix `ctrl` and reuses
    `buildVariantClasses`. Don't modify `app-button`.
18. **`app-carousel`:** wraps the `emblaCarousel` directive (`embla-carousel-angular`). Slides are
    projected content. Previous/next buttons use `app-button`, are always visible and get
    disabled at the ends. No autoplay. Keyboard accessible. On the server it renders as a
    normal list. Desktop shows 3 cards; phones show 1 card with the next one peeking in.
19. **`app-event-card`:** image, title, dates and city. Show the registration status
    (`coming-soon`, `open`, `closed`) as plain text, not as a pill-shaped badge.
20. Link to routes that don't exist yet anyway (`/churches`, `/events`, `/about`, `/ceape`,
    `/resources`, `/offerings`); they will be built later.

### Animations

Follow "Animation and carousels" in `CLAUDE.md` (`injectGsap()`, reduced motion, LCP). Spend
motion in **three places only**, and keep the rest still:

| Section          | Motion                                                                                                                                                                                                        | Tool                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Hero             | On load, the photo slowly zooms out (scale 1.08 → 1, `transform` only, never opacity). The crown drifts with the scroll. **The heading is not animated**: it's the LCP                                        | GSAP                             |
| Mission          | **Signature moment.** Split the quote into words. As the section scrolls through the viewport, each word goes from a muted color to `primary` (scrubbed). The muted color must still pass AA contrast (4.5:1) | GSAP `SplitText` + ScrollTrigger |
| Join us          | Depth: the 2–3 photos move at different speeds while scrolling (subtle parallax, `yPercent` inside `overflow-hidden` frames)                                                                                  | GSAP ScrollTrigger               |
| Events, programs | Hover and focus only: the card image scales slightly                                                                                                                                                          | Tailwind + `motion-reduce:`      |
| Everything else  | Nothing. No fade-and-slide-up on every section                                                                                                                                                                | —                                |

`SplitText` is part of the `gsap` package (`gsap/SplitText`). Register it inside the
`injectGsap()` setup. Splitting the text must keep it readable by screen readers (SplitText's
`aria` option) and must not change the layout.

### Images

21. Photos are already optimized as WebP, without metadata (no GPS):

| File                                                          | Use                            | Size      |
| ------------------------------------------------------------- | ------------------------------ | --------- |
| `public/images/home/hero-worship.webp`                        | Hero (LCP: `priority`)         | 1920×1074 |
| `public/images/home/vision-youth-reading.webp`                | Vision                         | 1200×984  |
| `public/images/home/join-sisters-embracing.webp`              | Join us collage                | 1200×625  |
| `public/images/home/join-brothers-embracing.webp`             | Join us collage                | 783×1400  |
| `public/images/home/join-laughing.webp`                       | Join us collage                | 1200×671  |
| `public/images/home/program-immersion.webp`                   | Immersion                      | 1036×1400 |
| `public/images/home/program-ceape.webp`                       | CEAPE                          | 1200×901  |
| `public/images/events/{madrid,porto,portugal,vaihingen}.webp` | Event cards                    | 960 wide  |
| `public/images/brand/lfae-crown-{white,navy}.webp`            | Hero and give crown (`alt=""`) | 1024×613  |

22. Always use `NgOptimizedImage` with `width`/`height` (or `fill` inside a box with a fixed
    `aspect-ratio`) so nothing shifts while loading. Only the hero photo gets `priority`; the rest
    load lazily. Use `object-fit: cover`.
23. **`alt` text** describes the scene, never names people: e.g. _"Young people worshipping
    together at a conference"_. Decorative images (crowns) get `alt=""`.
24. **Consent:** these photos show identifiable people, some of them young. Isaac must confirm the
    ministry has their consent before the page goes live (`// TODO: confirm photo consent` next to
    each photo). Don't add other photos of people without asking him.

## Checklist

Work **one step per commit**, in this order. Use Conventional Commits in English, e.g.
`feat(home): add hero section`.

- [ ] 1. `app-button-link` component
- [ ] 2. Event model, data and `EventService`
- [ ] 3. Hero
- [ ] 4. Mission (signature animation). **Ask Isaac to review it before going on**
- [ ] 5. Vision
- [ ] 6. `app-carousel`, `app-event-card` and the events section (hidden when empty)
- [ ] 7. Join us
- [ ] 8. Programs
- [ ] 9. Resources
- [ ] 10. Give
- [ ] 11. Final review: responsive at 360px, 768px and 1280px; keyboard navigation; reduced
      motion; AXE; and the `web-design-guidelines` skill if installed
- [ ] 12. **Delete this file and the `@MIGRATION.md` line in `CLAUDE.md`**, then open the PR

## Done means (for every step)

1. `pnpm lint` passes.
2. `npx tsc -p tsconfig.app.json --noEmit` passes.
3. `pnpm build` passes, with no budget errors.
4. With `pnpm start` running, take Playwright screenshots of the section at 360px and 1280px,
   and check it with reduced motion enabled too.
5. Tick the item in the checklist above, in the same commit.
