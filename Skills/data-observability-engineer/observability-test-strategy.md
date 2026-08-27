# Observability Test Strategy

## Purpose
Prove that data observability controls detect real failure modes, route incidents correctly, and recover cleanly instead of merely existing on dashboards.

## When to use
Use when introducing monitors, before major migrations, after repeated missed incidents, or during reliability hardening.

## Inputs
Monitor definitions, SLOs, known incident patterns, pipeline test environments, alert routing, lineage, runbooks.

## Preconditions
Tests must avoid corrupting production data; use isolated environments or controlled synthetic signals whenever possible.

## Context to inspect
Inspect check execution paths, alert transport, thresholds, suppressions, incident tooling, ownership, retry behavior, and recovery conditions.

## Core knowledge
Observability requires testing across detection, notification, diagnosis, and recovery. Unit-testing a query is not enough if alert routing or state clearing is broken.

## Procedure
1. Build a failure-mode inventory from architecture and incident history.
2. Map each high-risk failure to one or more controls.
3. Create synthetic cases for late, missing, duplicated, malformed, and schema-breaking data.
4. Test pipeline failures and stalled execution separately from data corruption.
5. Verify alerts include actionable context and reach correct owners.
6. Test deduplication, suppression, escalation, and recovery clearing.
7. Measure detection latency against SLO needs.
8. Add regression tests for previously missed incidents.
9. Run periodic game days for critical paths.
10. Track uncovered failure modes as engineering debt.

## Decision points
Use automated synthetic tests for deterministic controls; use game days for cross-system response paths. Avoid destructive chaos in production unless explicitly approved and safely bounded.

## Common failure patterns
- Testing query logic but not notification
- No recovery-state tests
- Synthetic cases unlike production failures
- Permanent alert suppressions after testing
- No regression tests after incidents

## Verification
A test passes only when the failure is detected, routed, diagnosable, and cleared correctly after recovery.

## Expected output
A coverage matrix, automated monitor tests, game-day scenarios, and evidence of end-to-end alert behavior.

## Stop conditions
Stop when testing could mutate regulated or irreplaceable production data, or when escalation channels cannot be exercised safely.