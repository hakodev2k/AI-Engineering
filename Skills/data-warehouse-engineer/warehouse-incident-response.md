# Warehouse Incident Response

## Purpose
Diagnose and recover from production warehouse incidents while limiting downstream business impact and preserving evidence for root-cause analysis.

## When to use
Use for stale data, failed pipelines, incorrect published metrics, runaway spend, warehouse outages, corrupted tables, or severe performance degradation.

## Inputs
Incident description, alerts, pipeline runs, query history, logs, lineage, recent deployments, data quality results, consumer impact.

## Context to inspect
Affected datasets and consumers, upstream dependencies, recent schema/code/config changes, warehouse health, checkpoints, access changes, and prior similar incidents.

## Core knowledge
Data incidents require both system recovery and semantic recovery. A pipeline can be green while published data is wrong. Response should prioritize containment, evidence, consumer communication, restoration, and verified correctness before optimization.

## Procedure
1. Establish impact, affected datasets, and severity.
2. Stop or quarantine unsafe publication when continued writes could worsen impact.
3. Preserve run IDs, logs, query IDs, code versions, and data samples.
4. Compare last-known-good and failing executions.
5. Trace upstream/downstream lineage to bound blast radius.
6. Form and test the highest-evidence hypotheses first.
7. Apply the smallest reversible mitigation.
8. Restore data through retry, rollback, replay, or backfill as appropriate.
9. Reconcile outputs before reopening consumption.
10. Document root cause, contributing factors, and prevention actions.

## Decision points
Rollback when a recent change is strongly implicated and reversal is safe. Replay when input is intact and processing is idempotent. Backfill when historical outputs are already wrong. Prefer containment over speculative live editing.

## Common failure patterns
Repeated blind retries, changing multiple variables at once, fixing pipeline status without validating data, deleting evidence, and reopening dashboards before reconciliation.

## Verification
Confirm freshness, quality checks, reconciled business metrics, downstream recovery, and absence of continuing errors.

## Expected output
A restored and verified warehouse service plus an evidence-based incident record and follow-up actions.

## Stop conditions
Escalate when recovery requires destructive production changes, privileged access not held, source data is unavailable, or evidence indicates legal/security impact.