# Future Frontend 2026 Break Slides

This repo serves a local Cloudflare Worker slide deck for the Future Frontend 2026 beamer between sessions. The deck is server-rendered HTML with generated Tailwind CSS and a small typed browser module for keyboard navigation.

The root route is an index of available slide and print tools. The `/slides` route shows the break slides. Session overview slides present the upcoming session, related talks, speaker names and pictures, the Future Frontend logo, and a single sponsor strip with larger tech sponsor slots and smaller brand sponsor slots. Each talk also gets a standalone title slide for use before the presentation or in post-production. The `/schedule` route shows one day schedule at a time and prints all days as A4 sheets. The `/speaker-checkin` route prints daily speaker check-in sheets for organizer use.

## Running

- Run `nvm use` before installing or running commands so Node.js matches `package.json` and `.nvmrc`.
- Install dependencies with `npm install`.
- Build generated assets with `npm run build`.
- Start the Worker with `npm run dev`, then open `http://127.0.0.1:8787`.
- Open `/slides` for the break slide deck.
- Use the left and right arrow keys to move between session, talk, and schedule slides.
- The current slide is persisted in the URL as `?slide=<number>`, using one-based slide numbers.
- Open `/schedule` for daily schedules. Use the same arrow key navigation on screen, or print the page to generate one A4 sheet per day.
- Open `/speaker-checkin` for daily speaker check-in sheets with arrival, microphone, slides, and notes columns. It uses the same arrow key navigation on screen, and prints the talk days as A4 sheets.

## Slide Content

- Session fallback data lives in `src/break-slides.json`; `npm run sync:slides` refreshes the generated `.generated/break-slides.json` artifact from the Future Frontend GraphQL API.
- Speaker images are loaded from the URLs stored in the synced schedule data and served through this Worker when they point to `futurefrontend.com/img/...`.
- Sponsor images are served through this Worker from the `futurefrontend.com/img/...` source assets.
- The provided Future Frontend logo is served from `src/assets/ff26-logo.svg`.
- Finlandica Headline Regular is served from `src/assets/FinlandicaHeadline-Regular.ttf`.

To sync schedule changes locally, copy `.dev.vars.example` to `.dev.vars`, set `FF26_GRAPHQL_URL`, `FF26_GRAPHQL_TOKEN`, and `FF26_CONFERENCE_ID`, then run `npm run sync:slides`. The values must live only in `.dev.vars`, shell/CI environment variables, or Cloudflare build variables and secrets. Do not commit them.

The sync script writes `.generated/break-slides.json`, which is ignored by git. Inspect the generated JSON after every sync because the speaker order, session grouping, and schedule-only intervals are production-facing slide content.

## Deployment

### Local Manual Deploy

1. Run `nvm use`.
2. Run `npm install` if dependencies are not installed.
3. Put the GraphQL values in untracked `.dev.vars`:
   - `FF26_GRAPHQL_URL`
   - `FF26_GRAPHQL_TOKEN`
   - `FF26_CONFERENCE_ID`
4. Run `npm run sync:slides`.
5. Review `.generated/break-slides.json`.
6. Run `npm run quality:gate`.
7. Run `npm run ci:local`.
8. Deploy with `npm run deploy`.

### Cloudflare Webhook Sync

Use a dedicated Cloudflare build/deploy hook for schedule refreshes. The sync script runs as a plain Node.js build command before Wrangler deploys the Worker, so Worker runtime secrets created with `wrangler secret put` are not available to `npm run sync:slides`.

Configure these values under the Cloudflare project settings at **Settings > Build > Build variables and secrets**:

- `FF26_GRAPHQL_URL`
- `FF26_GRAPHQL_TOKEN` as a secret
- `FF26_CONFERENCE_ID`

Then set the build command to:

```sh
npm run sync:slides && npm run build
```

Keep normal Worker runtime requests token-free. The public Worker should serve the already-synced slide data and generated assets; it should not call the GraphQL API when attendees load the deck.

If the Cloudflare job performs deployment directly, run `npm run deploy` after the sync and build steps. If the hook is a build-only trigger managed by Cloudflare, make sure its configured build command includes `npm run sync:slides && npm run build`.

For direct Wrangler deploys from a local shell or CI runner, expose the values to the shell that runs `npm run sync:slides`; do not rely on Worker runtime secrets:

```sh
npm run sync:slides
npm run deploy
```

## Verification

- Run quick checks with `npm run quality:gate:fast`.
- Run the full local baseline with `npm run quality:gate`.
- Run the local GitHub Actions workflow with `npm run ci:local`.
- Run unit tests with `npm test`.
- Run browser tests with `npm run e2e`.

For documentation-only changes that do not alter executable behavior or workflow configuration, `npm run format:check` is usually enough.

## Source Layout

- `src/worker.ts` is the Worker entry point and top-level router.
- `src/views/home.ts` renders the tool index and break slide deck.
- `src/views/schedule.ts` renders the printable daily schedules.
- `src/views/speaker-checkin.ts` renders printable speaker check-in sheets.
- `src/client/slides.ts` contains typed browser navigation behavior.
- `src/tailwind-input.css` defines the slide layout and visual system.
- `src/assets/` contains the local logo and font assets.
- `src/api/health.ts` serves a JSON health endpoint for smoke tests.
- Tests live next to the code they exercise under `src/`.

## Documentation

- Break slide behavior: `specs/break-slides/spec.md`
- Development setup and local CI: `docs/development.md`
- Architecture decisions: `docs/adrs/README.md`
- Feature and architecture specs: `specs/README.md`
- Agent behavior and project rules: `AGENTS.md`

Repo-specific truth lives in `ARCHITECTURE.md`, `specs/`, and `docs/adrs/`. Generated code still needs to match those documents, and passing CI alone is not enough.
