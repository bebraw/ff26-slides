# ADR-031: Lock Local Agent CI Installs

**Status:** Implemented

**Date:** 2026-06-01

**Amends:** [ADR-012](./ADR-012-constrain-local-tooling-to-macos.md), [ADR-026](./ADR-026-run-affected-guardrails-when-possible.md)

## Context

The local Agent CI workflow runs the same split fast, browser, and mutation jobs as GitHub Actions. Those jobs can run independently, but local Agent CI mounts a warm workspace and `node_modules` across jobs on macOS-hosted Docker. Running `npm ci` concurrently, or repeatedly against that same warm mount, can produce install-time races before project checks begin.

The template upstream added an install wrapper that runs plain `npm ci` on GitHub and serializes local Agent CI installs with a lock and package-lock readiness marker. In this Agent CI setup, the shared local state lives under the mounted workspace parent rather than `$RUNNER_TOOL_CACHE`, so the wrapper stores state there by default.

## Decision

Use `scripts/ci-install-dependencies.sh` for every CI dependency installation step.

- Outside local Agent CI, the wrapper runs plain `npm ci`.
- Inside local Agent CI, the wrapper stores lock and readiness markers under `.agent-ci-npm/` in the mounted workspace parent by default.
- `npm run ci:local` lets Agent CI use its normal job parallelism and pauses failed runners for retry.

## Trigger

The upstream template added a testing workflow improvement to avoid local Agent CI dependency-install races while allowing split test jobs to run concurrently.

## Consequences

**Positive:**

- Local Agent CI can run independent jobs concurrently without concurrent `npm ci` writes to the same warm mount.
- GitHub Actions behavior remains a direct `npm ci`.
- Failed local CI runners can pause for targeted retry.

**Negative:**

- The workflow has one more shell wrapper to maintain.
- Local Agent CI writes a small lock directory and readiness marker under the mounted workspace parent.

**Neutral:**

- The new write target is outside the repository checkout and documented as Agent CI local state.
- Remote CI still starts from clean dependency installation semantics.

## Alternatives Considered

### Keep `--jobs 1`

This reduces concurrency but still repeats installs against a warmed local mount and leaves Agent CI jobs serial.

### Disable Warm Dependency Reuse

This would simplify install behavior but make local CI slower and fight Agent CI's local-cache model.
