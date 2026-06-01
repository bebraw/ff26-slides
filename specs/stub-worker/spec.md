# Feature: Worker Shell

## Blueprint

### Context

The project keeps the lightweight Cloudflare Worker shell from the starter while replacing the original placeholder page with the Future Frontend break slide deck. The shell should remain small, testable, and easy to prune.

### Architecture

- **Entry points:** `wrangler dev` via `src/worker.ts`
- **Source layout:** `src/worker.ts` routes requests, `src/api/` holds API handlers, `src/views/` holds HTML rendering modules, `src/client/` holds typed browser modules, and `src/assets/` holds local slide assets.
- **Styling pipeline:** `src/tailwind-input.css` compiles to `.generated/styles.css`, which the Worker serves at `/styles.css`.
- **Client pipeline:** `src/client/slides.ts` compiles to `.generated/client/slides.js` and is copied to `.generated/client/slides.client.txt`, which the Worker serves at `/slides.js`.
- **Client code boundary:** Worker-rendered HTML must not embed executable browser code inline. Browser behavior belongs in typed TypeScript modules built into explicit assets.
- **Dependencies:** Wrangler provides the Worker runtime; Playwright and Vitest verify the behavior.

### Anti-Patterns

- Do not let the Worker shell drift into an untestable route pile.
- Do not collapse API handling and rendered views back into one file as the project evolves.
- Do not move styles back into large inline `<style>` blocks.
- Do not add inline script bodies, inline event-handler attributes, or `javascript:` URLs to Worker-rendered HTML.

## Contract

### Definition of Done

- [ ] The project starts locally through Wrangler without extra scaffolding.
- [ ] The root route returns the break slide deck.
- [ ] The health route returns stable JSON for smoke tests and tooling.
- [ ] The generated stylesheet and client module are served through Worker routes.
- [ ] The spec is updated in the same change set.
- [ ] Automated tests cover the critical behavior.

### Regression Guardrails

- `GET /` must keep returning HTML with recognizable Future Frontend slide content.
- The root index must list organizer tools without linking back to itself.
- `GET /styles.css` must keep returning the generated stylesheet.
- `GET /slides.js` must keep returning the generated client module.
- Worker/view runtime files must remain free of inline executable browser code.
- `GET /api/health` must keep returning HTTP 200 JSON with `ok: true`.
- Unknown routes must return HTTP 404.

### Verification

- **Automated tests:** colocated Vitest files under `src/**/*.test.ts` for module behavior and colocated Playwright files under `src/**/*.e2e.ts` for the browser-visible flow.
- **Coverage target:** Keep the `src/worker.ts`, `src/api/**`, and `src/views/**` branches, lines, functions, and statements above the repo coverage thresholds.
- **Layout target:** Break slides must keep header, main content, and sponsor strip inside compact iPad-sized viewports such as 1024 × 600.

### Scenarios

**Scenario: Organizer opens the slide deck**

- Given: the Worker is running locally
- When: the organizer visits `/`
- Then: they see the Future Frontend break slide deck

**Scenario: Tooling checks app health**

- Given: the Worker is running locally
- When: a tool requests `/api/health`
- Then: it receives a stable JSON response with `ok: true`

**Scenario: Browser requests generated assets**

- Given: the Worker is running locally
- When: the browser requests `/styles.css` or `/slides.js`
- Then: it receives the generated CSS or JavaScript through the same local runtime path used by the browser tests

**Scenario: Unknown route**

- Given: the Worker is running locally
- When: a request hits an undefined route
- Then: the Worker returns HTTP 404
