# ADR-027: Allow External Client Modules

**Status:** Implemented

**Date:** 2026-05-31

## Context

The break slide deck needs browser behavior for keyboard navigation and query-parameter persistence. ADR-024 correctly blocks untyped inline browser code in Worker-rendered HTML, but the current guard also blocks external script tags even when the browser code is written as a typed TypeScript module and served as a generated asset.

## Decision

Worker-rendered HTML may reference external browser modules with `<script src="...">` when the referenced behavior is authored in TypeScript and built into an explicit served asset.

Inline script bodies remain disallowed. Inline event-handler attributes and `javascript:` URLs remain disallowed.

## Consequences

**Positive:**

- Small interactive Worker-rendered pages can stay lightweight without adding a full application framework.
- Browser behavior remains type checked and testable before it is served.
- The existing guard still catches the risky inline cases it was designed to prevent.

**Negative:**

- Projects with client behavior now need a small build step for browser modules.
- Reviewers must verify that external scripts referenced by Worker views come from typed project source, not ad hoc static JavaScript.
