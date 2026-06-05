# Feature: Future Frontend Break Slides

## Blueprint

### Context

Future Frontend 2026 needs a local slide deck for the beamer between conference sessions and before individual presentations. The deck should tell attendees what is coming next, show the related talks and speakers for talk sessions, provide standalone title slides for each talk, include simple schedule slides for items such as registration, welcome, breaks, lunch, and day endings, provide printable daily schedules and speaker check-in sheets, and keep sponsor visibility present without turning the layout into a marketing page.

### Architecture

- **Entry point:** `GET /` renders an index linking to the available slide and print tools.
- **Slide deck view:** `GET /slides` renders the break slide deck.
- **Opening deck view:** `GET /opening` renders the conference opening slide deck using the same visual style and slide navigation as the break slide deck.
- **Closing deck view:** `GET /closing` renders the conference closing slide deck using the same visual style and slide navigation as the break and opening slide decks.
- **Schedule view:** `GET /schedule` renders one day schedule sheet at a time on screen and all day sheets for A4 printing.
- **Speaker check-in view:** `GET /speaker-checkin` renders one talk-day check-in sheet at a time on screen and all talk-day sheets for A4 printing.
- **Slide source:** `.generated/break-slides.json` contains the generated 2026 conference session data consumed by the Worker when present.
- **Fallback data:** `src/break-slides.json` contains committed fallback slide data for clean local builds and tests.
- **Schedule sync:** `npm run sync:slides` refreshes `.generated/break-slides.json` from the Future Frontend GraphQL API using `FF26_GRAPHQL_URL`, `FF26_GRAPHQL_TOKEN`, and `FF26_CONFERENCE_ID`.
- **Stream dividers:** The slide deck includes `divider` break-slide variants for the first two conference days: `FF26 – Day 1 (8.6.26)` and `FF26 - Day 2 (9.6.26)`. These render only in `/slides`, not in printable schedule or speaker check-in sheets.
- **Sync environment:** GraphQL values are build-time sync inputs. They stay in `.dev.vars`, shell/CI environment variables, or Cloudflare build variables and secrets, not Worker runtime configuration.
- **Talk slides:** `src/views/home.ts` derives one standalone slide per talk from the same session data, directly after the containing session overview slide.
- **Opening slides:** `src/views/opening.ts` renders the conference opening deck with a logo-only first slide, fixed event-introduction content, an 18-speaker photo grid derived from talk data, MC photos from conference or local asset image paths, sponsor tiers from `SlideData.sponsors`, and schedule-derived session overview and meetup slides.
- **Closing slides:** `src/views/closing.ts` renders the conference closing deck with a retrospective timeline, conference numbers including total meetups, topic follow-up notes, curated Flickr photo slides, thanks, a speaker image slide sourced from 2023-2025 speaker pages plus current GraphQL-backed `SlideData`, a workshop instructor image slide sourced from the 2023-2026 workshop pages, an organizer image slide sourced from the Future Frontend organizers page, an MC image slide sourced from 2023-2026 GraphQL `conference.mcs` data, an attendee visualization for roughly 600 attendees, a sponsor logo slide sourced from 2023-2025 sponsor sections plus `SlideData.sponsors` while excluding partners, a partner logo slide sourced from the 2023-2026 partner sections, an SDLCAI continuation slide, and a final `Thanks for all the fish` slide.
- **Navigation:** `src/client/slides.ts` handles left/right arrow navigation and horizontal touch swipe navigation, storing the current slide in the `slide` query parameter.
- **Print layout:** `src/tailwind-input.css` defaults print output to 16:10 slide pages and uses a marginless named A4 portrait page with an in-sheet margin for schedule and speaker check-in sheets. Schedule sheets include a compact print-only sponsor logo footer.
- **Client build:** `npm run build:client` compiles the typed client module to `.generated/client/slides.js`, copies the served text asset to `.generated/client/slides.client.txt`, and `npm run build` runs both CSS and client builds.
- **Assets:** The deck serves the provided Future Frontend logo at `/assets/ff26-logo.svg` and Finlandica Headline at `/fonts/FinlandicaHeadline-Regular.ttf`.
- **Conference image proxy:** `GET /img/*` fetches matching `futurefrontend.com/img/*` speaker and sponsor images server-side so rendered pages do not hotlink browser image requests to the main conference site.
- **Styling:** `src/tailwind-input.css` defines the black-and-white screen slide layout, 16:10 print slide output, and uses Finlandica Headline.
- **Sponsor strip:** Tech sponsors receive larger logo slots than brand sponsors in one horizontal footer strip.

### Anti-Patterns

- Do not add inline browser scripts to Worker-rendered HTML.
- Do not add a heavyweight slideshow framework for this small keyboard- and touch-controlled deck.
- Do not call the GraphQL API from public Worker request handling.
- Do not commit GraphQL tokens or other sync secrets.
- Do not put GraphQL sync secret names or values in `wrangler.jsonc`; the Worker runtime does not require them.
- Do not rely on Worker runtime secrets for `npm run sync:slides`; the sync script runs as a Node.js build command.
- Do not rely on the README or tests as the only durable source of slide behavior.
- Do not let sponsor layout dominate the upcoming-session content.

## Contract

### Definition of Done

- [ ] The root route renders an index of the slide and print tools.
- [ ] The slides route renders a full-viewport black-and-white slide deck.
- [ ] The opening route renders a full-viewport black-and-white opening slide deck.
- [ ] The closing route renders a full-viewport black-and-white closing slide deck.
- [ ] Printing the slides route uses 16:10 pages by default.
- [ ] The schedule route renders one daily schedule sheet at a time on screen.
- [ ] Printing the schedule route produces one A4 portrait sheet per day.
- [ ] Printed schedule sheets include the current sponsor logos at the bottom of each day.
- [ ] The speaker check-in route renders one talk-day check-in sheet at a time on screen.
- [ ] Printing the speaker check-in route produces one A4 portrait sheet per talk day.
- [ ] PDF exports of print sheets use a white page background and preserve explicit print colors.
- [ ] `npm run sync:slides` can refresh `.generated/break-slides.json` from the GraphQL schedule without adding runtime API calls.
- [ ] Talk-session slides show the upcoming session, related talks, speaker names, and speaker pictures.
- [ ] Each individual talk has a standalone slide showing the session, talk title, speaker names, and speaker pictures.
- [ ] Schedule-only slides such as registration, welcome, breaks, lunch, and ending of the day render without empty talk cards.
- [ ] Stream divider slides for Day 1 and Day 2 render in the slide deck without appearing in print tools.
- [ ] The footer shows tech and brand sponsor logos on one horizontal line, with tech sponsors larger.
- [ ] The opening deck includes the approved introduction slides: logo-only title slide, welcome, MCs, edition, attendee count, workshop count, 18-speaker photo grid, conference format, themed session overview, hallway track, sponsor logo tiers without visible sponsor names, meetups, code of conduct, hashtag, centered Q&A link, and Slack link rendered as a real href.
- [ ] Opening deck schedule and meetup slides render time ranges with spaces around the dash for readability, schedule overview and meetup times use a monospaced font for alignment, and the code of conduct slide links to the Berlin Code of Conduct.
- [ ] The closing deck includes the approved retrospective slides: title, four-edition timeline, two-row numbers layout, early-signal topics, curated photo slides, thanks, speaker images, workshop instructor images, organizer images, MC images, attendee visualization, sponsor logos, partner logos, SDLCAI handoff, and `Thanks for all the fish`.
- [ ] Arrow keys can move between slides.
- [ ] Horizontal touch swipes can move between slides on mobile and tablet browsers.
- [ ] The active slide is represented as a one-based `slide` query parameter.
- [ ] The deck includes the provided logo and Finlandica Headline font.
- [ ] Automated tests cover the rendered deck, generated client module route, static asset routes, keyboard navigation, and touch swipe navigation.

### Regression Guardrails

- `GET /` must keep linking to `/slides`, `/schedule`, and `/speaker-checkin`.
- `GET /` must keep linking to `/opening`.
- `GET /` must keep linking to `/closing`.
- `GET /slides` must keep rendering the deck title and conference sessions.
- `GET /opening` must keep rendering the opening deck logo title slide, MCs, 18-speaker photo grid, sponsor tiers, meetups, code of conduct, hashtag, Q&A URL, and Slack link.
- `GET /closing` must keep rendering the closing deck title slide, four-edition timeline, early-signal topics, curated photo slides, speaker images, workshop instructor images, organizer images, MC images, attendee visualization, sponsor logos, partner logos, SDLCAI handoff, and final `Thanks for all the fish` slide.
- `GET /slides` must keep rendering standalone slides for individual talks from talk-session data.
- `GET /slides` must keep rendering the Day 1 and Day 2 stream divider slides.
- `GET /schedule` must keep rendering daily schedule sheets from the same slide data.
- `GET /schedule` must not include stream divider slides as schedule rows.
- `GET /speaker-checkin` must keep rendering speaker check-in sheets from the same slide data.
- Print media styles must keep schedule and speaker check-in sheets on white A4 pages with print colors enabled for PDF export.
- `GET /slides.js` must return the built typed navigation module.
- `GET /img/*` must return conference speaker and sponsor images from the main conference site without exposing an open proxy.
- `GET /assets/ff26-logo.svg` must return the conference logo.
- `GET /fonts/FinlandicaHeadline-Regular.ttf` must return the Finlandica font.
- Worker/view runtime files must remain free of inline script bodies, inline event handlers, and `javascript:` URLs.
- Worker request handling must remain free of GraphQL schedule fetches and GraphQL API tokens.
- The route list returned by `/api/health` must include `/opening`, `/closing`, and `/slides.js`.

### Verification

- **Unit tests:** `src/views/home.test.ts` and `src/worker.test.ts`
- **Opening unit tests:** `src/views/opening.test.ts`
- **Closing unit tests:** `src/views/closing.test.ts`
- **Schedule unit tests:** `src/views/schedule.test.ts`
- **Speaker check-in unit tests:** `src/views/speaker-checkin.test.ts`
- **Browser tests:** `src/worker.e2e.ts`
- **Targeted checks:** `npm run build`, `npm test`, `npm run worker:client-guard`, and `npm run sync:slides` when GraphQL credentials are available
- **Readiness baseline:** `npm run quality:gate` and `npm run ci:local` for non-documentation changes.

### Scenarios

**Scenario: Attendee sees the next session**

- Given: the `/slides` deck is open on the beamer
- When: a break slide is active
- Then: attendees can see the next session name, talk titles, speaker names, and speaker images

**Scenario: Organizer finds slide tools**

- Given: the root route is open
- When: the organizer reviews the index
- Then: they can open the break slide deck, opening slide deck, daily schedule, or speaker check-in sheets

**Scenario: Organizer opens the conference**

- Given: the opening route is open
- When: the organizer advances through the deck
- Then: the approved opening slides are visible using the same slide style and navigation as the break deck

**Scenario: Organizer closes the conference**

- Given: the closing route is open
- When: the organizer advances through the deck
- Then: the approved closing slides are visible using the same slide style and navigation as the break and opening decks

**Scenario: Attendee sees what continues**

- Given: the closing route is open
- When: the SDLCAI handoff slide is active
- Then: attendees can see `SDLCAI`, the 13 October 2026 date, the Aalto University, Espoo location, and `sdlcai.org` as a link

**Scenario: Organizer refreshes the schedule**

- Given: `.dev.vars` contains valid `FF26_GRAPHQL_URL`, `FF26_GRAPHQL_TOKEN`, and `FF26_CONFERENCE_ID`
- When: the organizer runs `npm run sync:slides`
- Then: `.generated/break-slides.json` is rewritten from the GraphQL schedule data without exposing the token in committed source

**Scenario: Attendee sees a schedule-only interval**

- Given: the `/slides` deck is open on the beamer
- When: a registration, welcome, break, lunch, or ending slide is active
- Then: attendees can see the schedule item without empty talk or speaker placeholders

**Scenario: Organizer advances slides**

- Given: the `/slides` deck is open in a browser
- When: the organizer presses the right arrow key
- Then: the next session, talk, or schedule slide becomes visible and the URL updates to `?slide=<number>`

**Scenario: Organizer advances slides on touch devices**

- Given: the `/slides` deck is open on a mobile or tablet browser
- When: the organizer swipes left across the slide
- Then: the next session, talk, or schedule slide becomes visible and the URL updates to `?slide=<number>`

**Scenario: Organizer views the daily schedule**

- Given: the schedule route is open
- When: the organizer presses the right arrow key
- Then: the next day schedule becomes visible and the URL updates to `?slide=<number>`

**Scenario: Organizer prints schedules**

- Given: the schedule route is open
- When: the organizer prints the page
- Then: each day schedule is rendered as its own A4 portrait page

**Scenario: Organizer prints speaker check-in sheets**

- Given: the speaker check-in route is open
- When: the organizer prints the page
- Then: each talk day is rendered as its own A4 portrait page with arrival, microphone, slides, and notes columns

**Scenario: Organizer shows an individual talk title**

- Given: the `/slides` deck is open on a talk-session overview
- When: the organizer advances to the next slide
- Then: the individual talk slide shows the talk title, session name, speaker names, and speaker images

**Scenario: Organizer shows a stream day divider**

- Given: the `/slides` deck is open before a conference day starts
- When: the organizer navigates to a day divider slide
- Then: the deck shows the matching `FF26` day title for YouTube stream graphics

**Scenario: Browser opens a persisted slide**

- Given: the URL contains `?slide=2`
- When: the deck loads
- Then: the second slide is visible first
