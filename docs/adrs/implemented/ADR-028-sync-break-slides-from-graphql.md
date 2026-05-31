# ADR-028: Sync Break Slides From GraphQL

**Status:** Implemented

**Date:** 2026-05-31

## Context

The break slide schedule can change after the deck has been prepared. Manually editing committed fallback data keeps runtime behavior simple, but it risks stale titles, speakers, images, and session grouping when the public Future Frontend schedule changes.

Writing synced data back into `src/` also makes the sync command feel like a source-code mutation, even when the output is just deployment input.

The Future Frontend site already reads schedule data from a GraphQL API with `API_URL`, `API_TOKEN`, and a custom `TOKEN` header. The slide deck needs the same source of truth, but it should not expose the API token or add a network dependency to attendee-facing Worker requests.

## Decision

Add a sync-time importer behind `npm run sync:slides`.

The importer reads:

- `FF26_GRAPHQL_URL`
- `FF26_GRAPHQL_TOKEN`
- `FF26_CONFERENCE_ID`

It sends the token as a `TOKEN` header, queries the conference schedule, normalizes intervals and talks into the existing `BreakSlide[]` shape, and writes `.generated/break-slides.json`.

`src/break-slides.json` remains a committed fallback for clean local builds and tests. `npm run build` copies that JSON fallback to `.generated/break-slides.json` when no synced artifact exists.

The public Worker continues to serve only committed or deployment-generated slide data. It does not call the GraphQL API during request handling.

## Consequences

**Positive:**

- The deck can be refreshed from the authoritative schedule source.
- Sync no longer dirties committed source files.
- Runtime requests stay fast, deterministic, and token-free.
- Cloudflare webhook-triggered updates can run the same sync command before build or deploy.

**Negative:**

- Sync output must be reviewed because source schedule structure affects on-screen production slides.
- Deploy jobs that rely on live schedule updates need the GraphQL values configured as secrets.
- The importer has to maintain a small mapping layer between GraphQL schedule data and the slide deck contract.
