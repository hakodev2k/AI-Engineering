# Background Work

## Purpose
Run deferred mobile work reliably within OS scheduling, battery, and lifecycle constraints.

## When to use
Sync, uploads, maintenance, periodic refresh, deferred processing.

## Inputs
Task requirements, deadlines, connectivity/power constraints, retry semantics.

## Context to inspect
Platform scheduler APIs, app lifecycle, persistence, server idempotency, foreground-service rules.

## Core knowledge
Mobile OSes do not guarantee arbitrary continuous background execution. Work must be resumable, bounded, persistent, and tolerant of process death.

## Procedure
1. Classify work as immediate, deferrable, periodic, or user-visible long-running.
2. Select the platform scheduling primitive.
3. Persist minimal work state.
4. Define network/power constraints.
5. Make operations idempotent and resumable.
6. Bound retries with backoff.
7. Respect cancellation and execution limits.
8. Add observability for starts, completion, retries, and abandonment.
9. Test process termination and device constraints.

## Decision points
Use foreground execution only when user-visible and policy-compliant; otherwise prefer scheduler-managed work.

## Common failure patterns
Timers as schedulers, assuming process survival, retry storms, duplicate uploads, battery drain.

## Verification
Kill/restart tests, offline recovery, battery/network constraint tests.

## Expected output
Resumable background workflow aligned with platform guarantees.

## Stop conditions
Escalate requirements demanding guarantees the OS cannot provide.