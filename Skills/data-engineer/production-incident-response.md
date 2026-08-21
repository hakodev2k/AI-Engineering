# Production Data Incident Response

## Purpose
Diagnose, contain, recover, and learn from incidents involving stale, missing, duplicated, corrupted, or incorrectly published data.

## When to use
Use when production data pipelines or datasets violate correctness, freshness, availability, or security expectations.

## Inputs
Incident symptoms, alerts, lineage, run history, logs, quality metrics, recent changes, and consumer impact.

## Context to inspect
Inspect affected datasets, upstream dependencies, checkpoints, source state, recent deployments, schema changes, retries, and downstream consumption.

## Core knowledge
Data incidents can persist after compute recovers because bad state may already be published. Prioritize consumer impact, preserve evidence, distinguish pipeline failure from data corruption, and make recovery reproducible.

## Procedure
1. Establish incident scope and consumer impact.
2. Freeze destructive retries or publication if they can worsen state.
3. Identify the earliest known-good boundary.
4. Trace lineage upstream and recent changes.
5. Determine whether data is missing, duplicated, stale, or semantically wrong.
6. Contain exposure and communicate affected intervals.
7. Fix the causal defect before large-scale replay where possible.
8. Reprocess from a controlled boundary.
9. Reconcile recovered outputs.
10. Record root cause and prevention actions.

## Decision points
Prefer temporary staleness over publishing known-wrong data when consumer risk is higher. Roll back code when it restores correctness faster; roll forward when state migration makes rollback unsafe.

## Common failure patterns
Blind retries, deleting evidence, fixing dashboards instead of source data, replaying before idempotency is proven, and declaring recovery when jobs are green but datasets remain wrong.

## Verification
Reconcile affected intervals, confirm consumer-facing freshness and correctness, verify no duplicate side effects, and monitor subsequent scheduled runs.

## Expected output
A contained and reconciled incident with documented root cause, recovery evidence, and prevention actions.

## Stop conditions
Escalate for security exposure, irreversible deletion, uncertain blast radius, or recovery actions requiring production approvals beyond current authority.