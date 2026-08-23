# Background Execution and Push Notifications

## Purpose
Implement background work and notifications within iOS lifecycle, energy, delivery, and execution-time constraints.

## When to use
Use for refresh, processing tasks, silent/content pushes, background transfers, or notification actions.

## Inputs
Freshness SLA, server push behavior, task duration, network needs, user-notification requirements.

## Context to inspect
BGTaskScheduler identifiers, capabilities, APNs registration, notification service/content extensions, background URLSession, task expiration handling.

## Core knowledge
iOS background execution is opportunistic except for narrowly defined modes. Push delivery is not guaranteed. Work must be resumable, idempotent, bounded, and safe under termination.

## Procedure
1. Classify work by foreground, opportunistic refresh, processing, transfer, or notification needs.
2. Select only platform-supported background mechanism.
3. Persist work/progress before scheduling when durability matters.
4. Make handlers idempotent and cancellation-aware.
5. Respect expiration callbacks and checkpoint state.
6. Validate notification payloads and minimize sensitive content.
7. Reschedule based on real freshness needs.
8. Instrument scheduling, start, completion, expiration, and delivery outcomes.
9. Test device-state and network variations.

## Decision points
Use background URLSession for durable transfers; BGTask APIs for discretionary application work; push as a hint, not a guaranteed scheduler.

## Common failure patterns
Timers as background strategy, excessive refresh, assuming silent push delivery, unfinished expiration handling, duplicate processing, and PII in payloads.

## Verification
Test foreground/background/terminated states, expiration, offline recovery, duplicate push, disabled notifications, and low-power conditions where feasible.

## Expected output
Bounded background workflow with durable state and observable delivery/execution behavior.

## Stop conditions
Stop when requirements demand guaranteed execution that iOS cannot provide.