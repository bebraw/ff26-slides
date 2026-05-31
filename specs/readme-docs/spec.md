# Feature: README Docs

## Blueprint

### Context

The README is the first surface contributors see. It should identify the current Future Frontend break slide app clearly near the top, explain how repo-specific docs relate to generated code, and point contributors at the current runtime and verification commands.

### Architecture

- **Primary document:** `README.md`
- **Current workflow summary:** runtime, slide content, verification, source layout, and documentation contract notes in `README.md`
- **Update model:** manual README update when the app behavior, routes, assets, or workflow commands change
- **Non-goal:** no screenshot capture in the automated development loop, CI, or remote workflows

### Anti-Patterns

- Do not make readers infer the app shape from source files alone before they understand the runtime baseline.
- Do not imply that generated code becomes authoritative just because CI passes.
- Do not let the README drift away from the actual commands, ports, assets, or source layout used by the current project.

## Contract

### Definition of Done

- [ ] The README identifies the break slide deck as a Cloudflare Worker served with Wrangler near the top.
- [ ] The README explains the current slide content and asset sources.
- [ ] The README explains how repo-specific architecture, spec, and ADR documents relate to generated code.
- [ ] The README reflects the current runtime and verification commands.

### Regression Guardrails

- `README.md` should let a new reader understand the current break slide app and rendering model before they start exploring the source tree.
- `README.md` should describe the current documentation contract accurately, including that specs and ADRs remain authoritative over generated code.
- `README.md` should continue to describe the current source layout and verification flow accurately.
- `README.md` should describe the current runtime pin source accurately when the repo toolchain changes.
- `README.md` should describe the supported host platform baseline accurately when local development constraints change.
- `README.md` should point browser setup at the current pinned Playwright install script instead of an ad hoc command.

### Verification

- **Manual check:** verify the README commands, ports, and source paths match the repo.
- **Repo check:** `git diff --check`
- **Baseline gate:** `npm run quality:gate` and `npm run ci:local`

### Scenarios

**Scenario: Reader opens the README**

- Given: the repo is viewed locally or on Git hosting
- When: the reader starts at the top of the document
- Then: they can tell quickly that the break slides are served by a Cloudflare Worker with Wrangler and centered on server-rendered HTML

**Scenario: Contributor follows the README**

- Given: the current project baseline
- When: the contributor reads the runtime, verification, and source layout sections
- Then: the commands, ports, and file locations match the current repo behavior

**Scenario: Contributor evaluates generated changes**

- Given: a contributor or agent proposes code generated with AI assistance
- When: they read the README documentation notes
- Then: they understand that specs and ADRs remain the durable source of truth and that CI passing does not replace those documents

**Scenario: App behavior changes materially**

- Given: the rendered application changes enough that README guidance is misleading
- When: the change is completed
- Then: the developer updates the README manually
