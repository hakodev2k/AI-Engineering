# Backfill and Replay Rules

## Purpose
Allow historical reconstruction without corrupting live state or overwhelming infrastructure.

## Scope
Replay ranges, backfills, reprocessing, cutovers, throttling, and validation.

## MUST
- Replay scope MUST be bounded by explicit source positions, time ranges, or equivalent identifiers.
- Backfills MUST define interaction with concurrent live CDC.
- Replayed events MUST preserve original source ordering metadata when available.
- Capacity impact MUST be assessed before large replay execution.
- Completion MUST be validated against source or trusted reconciliation evidence.

## MUST NOT
- MUST NOT replay side effects blindly when consumers are not replay-safe.
- MUST NOT overwrite newer state with older events.
- MUST NOT start a large production replay without explicit human approval.

## SHOULD
- Use separate lanes or rate limits for bulk replay.
- Make backfills resumable and observable.

## Exceptions
Emergency replay may use expedited approval but still requires scope, rollback/stop criteria, and validation.

## Verification
Inspect replay bounds, rate metrics, ordering checks, downstream state, and reconciliation reports.