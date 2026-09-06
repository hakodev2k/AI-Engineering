# API Deprecation and Retirement

## Purpose
Retire obsolete APIs safely using evidence, communication, migration support, and explicit exit criteria.

## When to use
Use when replacing versions, removing legacy endpoints, consolidating platforms, or eliminating insecure interfaces.

## Inputs
Usage telemetry, consumer inventory, replacement contract, ownership data, risk and support timelines.

## Context to inspect
Inspect actual traffic, unknown callers, contractual obligations, SDK usage, documentation, and operational dependencies.

## Core knowledge
Deprecation is a consumer migration program, not a documentation label. Retirement requires reliable attribution of remaining usage and a viable replacement.

## Procedure
1. Define reason and target retirement outcome.
2. Verify replacement capability and migration path.
3. Identify consumers from telemetry and ownership records.
4. Publish deprecation status and deadline through multiple channels.
5. Provide migration examples and compatibility notes.
6. Add response headers or portal indicators where appropriate.
7. Track usage decline by consumer.
8. Contact remaining owners and investigate unknown traffic.
9. Conduct staged disablement or controlled tests when risk warrants.
10. Retire only after explicit criteria and rollback planning are satisfied.

## Decision points
Accelerate retirement for critical security risk with appropriate governance; otherwise allow timelines proportional to consumer migration complexity.

## Common failure patterns
Relying on email alone, missing machine clients, removing docs too early, and declaring zero traffic from incomplete telemetry.

## Verification
Confirm replacement readiness, consumer migration, negligible/zero valid traffic, and rollback capability before final removal.

## Expected output
A measurable deprecation campaign ending in safe retirement.

## Stop conditions
Stop if unidentified production consumers remain or replacement functionality is incomplete.