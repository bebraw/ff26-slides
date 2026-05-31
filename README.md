# Future Frontend 2026 Break Slides

This repo serves a local Cloudflare Worker slide deck for the Future Frontend 2026 beamer between sessions. The deck is server-rendered HTML with generated Tailwind CSS and a small typed browser module for keyboard navigation.

The root route shows the break slides. Each slide presents the upcoming session, related talks, speaker names and pictures, the Future Frontend logo, and a single sponsor strip with larger tech sponsor slots and smaller brand sponsor slots.

## Running

- Run `nvm use` before installing or running commands so Node.js matches `package.json` and `.nvmrc`.
- Install dependencies with `npm install`.
- Build generated assets with `npm run build`.
- Start the Worker with `npm run dev`, then open `http://127.0.0.1:8787`.
- Use the left and right arrow keys to move between slides.
- The current slide is persisted in the URL as `?slide=<number>`, using one-based slide numbers.

## Slide Content

- Session data is curated in `src/views/home.ts` from the public Future Frontend schedule at `https://futurefrontend.com/schedule/`.
- Speaker and sponsor images are loaded from `https://futurefrontend.com/img/...`.
- The provided Future Frontend logo is served from `src/assets/ff26-logo.svg`.
- Finlandica Headline Regular is served from `src/assets/FinlandicaHeadline-Regular.ttf`.

When the conference schedule changes, update `src/views/home.ts` and keep the break slide spec in `specs/break-slides/spec.md` in sync.

## Verification

- Run quick checks with `npm run quality:gate:fast`.
- Run the full local baseline with `npm run quality:gate`.
- Run the local GitHub Actions workflow with `npm run ci:local`.
- Run unit tests with `npm test`.
- Run browser tests with `npm run e2e`.

For documentation-only changes that do not alter executable behavior or workflow configuration, `npm run format:check` is usually enough.

## Source Layout

- `src/worker.ts` is the Worker entry point and top-level router.
- `src/views/home.ts` renders the break slide deck.
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
