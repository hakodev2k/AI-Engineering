# Replay and Backfill

## Purpose
Reprocess historical events safely for recovery, new projections, bug fixes, or data backfills.

## When to use
Use when rebuilding derived state or intentionally applying retained events again.

## Inputs
Event range, target consumer/projection, retention, side effects, throughput limits, corrected code version.

## Context to inspect
Source immutability, checkpoints, idempotency, external calls, production capacity, schema versions, and audit requirements.

## Core knowledge
Replay changes temporal and load assumptions. Consumers safe for live traffic may be unsafe for replay if they send emails, charge accounts, or call external systems. Historical schemas must remain interpretable.

## Procedure
1. State the exact replay objective and boundaries.
2. Classify every handler side effect.
3. Disable or redirect non-replay-safe effects.
4. Validate historical schema compatibility.
5. Use isolated consumer identity/checkpoint where possible.
6. Estimate load and throttle below safe capacity.
7. Run a small canary range.
8. Compare derived results with expected invariants.
9. Expand progressively with monitoring.
10. Record range, code version, results, and final checkpoint.

## Decision points
Rebuild into a shadow target for high-risk projections; use in-place replay only when updates are provably idempotent and rollback is available.

## Common failure patterns
Triggering real-world effects, resetting production offsets blindly, saturating databases, skipping old schemas, and replaying without audit boundaries.

## Verification
Canary and full-range reconciliation pass; no unintended external effects occur; live SLOs remain healthy.

## Expected output
A controlled replay plan and evidence of reconciled results.

## Stop conditions
Stop on unexpected side effects, capacity degradation, schema decode failures, or reconciliation drift.