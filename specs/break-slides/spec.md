# Feature: Future Frontend Break Slides

## Blueprint

### Context

Future Frontend 2026 needs a local slide deck for the beamer between conference sessions and before individual presentations. The deck should tell attendees what is coming next, show the related talks and speakers for talk sessions, provide standalone title slides for each talk, include simple schedule slides for items such as registration, welcome, breaks, lunch, and day endings, and keep sponsor visibility present without turning the layout into a marketing page.

### Architecture

- **Entry point:** `GET /` renders the break slide deck.
- **Slide source:** `.generated/break-slides.json` contains the generated 2026 conference session data consumed by the Worker when present.
- **Fallback data:** `src/break-slides.json` contains committed fallback slide data for clean local builds and tests.
- **Schedule sync:** `npm run sync:slides` refreshes `.generated/break-slides.json` from the Future Frontend GraphQL API using `FF26_GRAPHQL_URL`, `FF26_GRAPHQL_TOKEN`, and `FF26_CONFERENCE_ID`.
- **Secret declaration:** `wrangler.jsonc` declares the required GraphQL secret names, while actual values stay in `.dev.vars`, shell/CI environment variables, or Cloudflare secrets.
- **Talk slides:** `src/views/home.ts` derives one standalone slide per talk from the same session data, directly after the containing session overview slide.
- **Navigation:** `src/client/slides.ts` handles left/right arrow navigation and stores the current slide in the `slide` query parameter.
- **Client build:** `npm run build:client` compiles the typed client module to `.generated/client/slides.js`, copies the served text asset to `.generated/client/slides.client.txt`, and `npm run build` runs both CSS and client builds.
- **Assets:** The deck serves the provided Future Frontend logo at `/assets/ff26-logo.svg` and Finlandica Headline at `/fonts/FinlandicaHeadline-Regular.ttf`.
- **Styling:** `src/tailwind-input.css` defines the black-and-white 16:9 slide layout and uses Finlandica Headline.
- **Sponsor strip:** Tech sponsors receive larger logo slots than brand sponsors in one horizontal footer strip.

### Anti-Patterns

- Do not add inline browser scripts to Worker-rendered HTML.
- Do not add a heavyweight slideshow framework for this small keyboard-controlled deck.
- Do not call the GraphQL API from public Worker request handling.
- Do not commit GraphQL tokens or other sync secrets.
- Do not put GraphQL secret values in `wrangler.jsonc`; declare only their names.
- Do not rely on the README or tests as the only durable source of slide behavior.
- Do not let sponsor layout dominate the upcoming-session content.

## Contract

### Definition of Done

- [ ] The root route renders a full-viewport black-and-white slide deck.
- [ ] `npm run sync:slides` can refresh `.generated/break-slides.json` from the GraphQL schedule without adding runtime API calls.
- [ ] Talk-session slides show the upcoming session, related talks, speaker names, and speaker pictures.
- [ ] Each individual talk has a standalone slide showing the session, talk title, speaker names, and speaker pictures.
- [ ] Schedule-only slides such as registration, welcome, breaks, lunch, and ending of the day render without empty talk cards.
- [ ] The footer shows tech and brand sponsor logos on one horizontal line, with tech sponsors larger.
- [ ] Arrow keys can move between slides.
- [ ] The active slide is represented as a one-based `slide` query parameter.
- [ ] The deck includes the provided logo and Finlandica Headline font.
- [ ] Automated tests cover the rendered deck, generated client module route, static asset routes, and keyboard navigation.

### Regression Guardrails

- `GET /` must keep rendering the deck title and conference sessions.
- `GET /` must keep rendering standalone slides for individual talks from talk-session data.
- `GET /slides.js` must return the built typed navigation module.
- `GET /assets/ff26-logo.svg` must return the conference logo.
- `GET /fonts/FinlandicaHeadline-Regular.ttf` must return the Finlandica font.
- Worker/view runtime files must remain free of inline script bodies, inline event handlers, and `javascript:` URLs.
- Worker request handling must remain free of GraphQL schedule fetches and GraphQL API tokens.
- The route list returned by `/api/health` must include `/slides.js`.

### Verification

- **Unit tests:** `src/views/home.test.ts` and `src/worker.test.ts`
- **Browser tests:** `src/worker.e2e.ts`
- **Targeted checks:** `npm run build`, `npm test`, `npm run worker:client-guard`, and `npm run sync:slides` when GraphQL credentials are available
- **Readiness baseline:** `npm run quality:gate` and `npm run ci:local` for non-documentation changes.

### Scenarios

**Scenario: Attendee sees the next session**

- Given: the deck is open on the beamer
- When: a break slide is active
- Then: attendees can see the next session name, talk titles, speaker names, and speaker images

**Scenario: Organizer refreshes the schedule**

- Given: `.dev.vars` contains valid `FF26_GRAPHQL_URL`, `FF26_GRAPHQL_TOKEN`, and `FF26_CONFERENCE_ID`
- When: the organizer runs `npm run sync:slides`
- Then: `.generated/break-slides.json` is rewritten from the GraphQL schedule data without exposing the token in committed source

**Scenario: Attendee sees a schedule-only interval**

- Given: the deck is open on the beamer
- When: a registration, welcome, break, lunch, or ending slide is active
- Then: attendees can see the schedule item without empty talk or speaker placeholders

**Scenario: Organizer advances slides**

- Given: the deck is open in a browser
- When: the organizer presses the right arrow key
- Then: the next session, talk, or schedule slide becomes visible and the URL updates to `?slide=<number>`

**Scenario: Organizer shows an individual talk title**

- Given: the deck is open on a talk-session overview
- When: the organizer advances to the next slide
- Then: the individual talk slide shows the talk title, session name, speaker names, and speaker images

**Scenario: Browser opens a persisted slide**

- Given: the URL contains `?slide=2`
- When: the deck loads
- Then: the second slide is visible first
