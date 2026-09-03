# Production Debugging

## Purpose
Diagnose missing, delayed, duplicated, or incorrect event-driven outcomes using evidence rather than assumptions.

## When to use
Use during incidents, consumer lag, inconsistent projections, or unexplained workflow states.

## Inputs
Incident timeline, event IDs, correlation IDs, logs, traces, broker metrics, consumer state.

## Context to inspect
Producer publish evidence, broker partitions/offsets, consumer group state, retries, DLQ, deployments, dependency health, and data-store transactions.

## Core knowledge
The fault may occur before publish, in routing/retention, during consumption, in side effects, or in observability itself. Correlation and immutable identities enable timeline reconstruction.

## Procedure
1. Define the expected versus observed business outcome.
2. Establish time range and stable identifiers.
3. Confirm source transaction committed.
4. Find producer publication/outbox evidence.
5. Verify broker arrival, partition, offset, and retention.
6. Inspect consumer assignment, lag, attempts, and errors.
7. Confirm local transaction and downstream side effects.
8. Check duplicate/order/version handling.
9. Compare with recent deploy/config/schema changes.
10. Mitigate safely, preserve evidence, then determine root cause.
11. Add regression tests and telemetry gaps discovered.

## Decision points
Replay only after understanding side effects. Prefer restoring processing capacity before code changes when backlog is caused by dependency saturation.

## Common failure patterns
Searching only application logs, replaying blindly, deleting poison messages, changing offsets without evidence, and confusing correlation IDs with event IDs.

## Verification
A reconstructed timeline explains the failure and a controlled reproduction or regression test validates the fix.

## Expected output
Evidence-backed root cause, mitigation, corrective action, and prevention measures.

## Stop conditions
Stop before destructive offset changes, production data edits, or mass replay without required approval.