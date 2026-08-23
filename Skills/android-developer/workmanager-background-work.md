# WorkManager Background Work

## Purpose
Implement deferrable, durable Android background work that respects OS constraints, process death, retries, and duplicate execution.

## When to use
Use for uploads, synchronization, cleanup, refresh, or deferred work that should complete even after the app process exits. Do not use WorkManager for exact alarms or immediate foreground interactions.

## Inputs
Work semantics, timing requirements, constraints, retry policy, payload size, side effects, user-visible expectations.

## Preconditions
Determine whether work must be immediate, exact, long-running, or merely eventually completed.

## Context to inspect
Worker classes, unique work names, chains, constraints, input/output data, foreground service use, repositories, notifications, and cancellation behavior.

## Core knowledge
WorkManager provides persistent scheduling, not exactly-once execution. Workers must tolerate replay, constraint changes, app upgrades, and process termination.

## Procedure
1. Classify the job by urgency and durability.
2. Define an idempotency strategy before enqueueing side-effecting work.
3. Store large or durable payloads outside WorkManager Data.
4. Choose unique work and replacement/keep policies deliberately.
5. Define network, charging, storage, or battery constraints only when required.
6. Propagate cancellation and bound execution.
7. Classify result as success, retry, or terminal failure.
8. Use foreground execution only when platform rules require it.
9. Test duplicate enqueue, process kill, constraint loss, retry, and app upgrade.
10. Instrument completion latency and terminal failures.

## Decision points
Use expedited work only for legitimate user-important urgent tasks. Use periodic work for approximate recurring execution, not exact schedules.

## Common failure patterns
Assuming exactly-once, passing large blobs in Data, retrying permanent errors, duplicate unique-work names, unnecessary constraints, and hidden long-running work.

## Verification
Verify persistence across process kill and reboot-equivalent test environments, idempotent replay, cancellation, and correct terminal states.

## Expected output
Worker contract, enqueue policy, retry/idempotency design, constraints, and test evidence.

## Stop conditions
Escalate when requirements demand exact timing, unrestricted background execution, or platform-prohibited behavior.