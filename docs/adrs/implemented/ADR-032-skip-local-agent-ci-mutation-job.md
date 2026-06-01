# ADR-032: Skip Local Agent CI Mutation Job

**Status:** Implemented

**Date:** 2026-06-01

## Context

The repo already runs mutation testing locally through `npm run quality:gate`, where
Stryker uses incremental mode for repeated runs. GitHub Actions still needs the full
mutation job so remote CI verifies test assertion strength without relying on a
developer's local incremental cache.

Local Agent CI runs the GitHub Actions workflow through macOS-hosted Docker. In this
environment the full mutation job can fail in the runner before it gives useful
project feedback, while the direct local `npm run quality:gate` path remains the
supported local mutation signal.

## Decision

Keep the `quality-mutation` job in `.github/workflows/ci.yml`, but guard it with
`github.server_url == 'https://github.com'` so github.com runs execute full mutation
testing and local Agent CI skips that job.

Local readiness for mutation remains `npm run quality:gate` or `npm run mutation`.
Local Agent CI remains responsible for workflow-shaped fast and browser checks.

## Trigger

The local Agent CI workflow failed in the mutation runner while the direct local
quality gate passed. The local workflow needed to stop spending time on a check that
already has a reliable local command and a remote GitHub Actions gate.

## Consequences

**Positive:**

- Local Agent CI gives faster workflow-shaped feedback for fast and browser checks.
- GitHub Actions still runs the full mutation gate on push and pull request runs.
- Local mutation verification stays available through the project scripts.

**Negative:**

- `npm run ci:local` no longer mirrors every remote job exactly.
- Contributors must remember that local Agent CI does not cover mutation strength.

**Neutral:**

- The remote workflow keeps the same `quality-mutation` job name.
- The readiness baseline still includes local mutation through `npm run quality:gate`.

## Alternatives Considered

### Keep Running Mutation In Local Agent CI

This preserves perfect job parity, but it keeps a slow and currently unreliable
runner path in the default local workflow.

### Remove The Mutation Job From GitHub Actions

This would make local and remote workflow shape match again, but it weakens remote
CI by removing full mutation verification from pull requests and pushes.

### Use Incremental Mutation In GitHub Actions

This would reduce runtime, but GitHub Actions should not depend on local incremental
state when validating mutation strength.
