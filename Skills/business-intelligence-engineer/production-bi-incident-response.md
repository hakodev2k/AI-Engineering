# Production BI Incident Response

## Purpose
Restore trustworthy BI service during data, refresh, semantic, security, or performance incidents while preserving evidence for root-cause analysis.

## When to use
Use when critical dashboards are wrong, stale, unavailable, leaking access, or materially slow.

## Inputs
Incident report, telemetry, lineage, refresh logs, recent changes, quality results, affected assets, business criticality.

## Context to inspect
Inspect source health, pipeline runs, semantic refresh, gateway/capacity, permissions, recent deployments, and downstream dependencies.

## Core knowledge
Incorrect data can be more harmful than unavailable data. Incident handling prioritizes containment, impact communication, evidence preservation, safe restoration, and prevention.

## Procedure
1. Confirm symptom and timestamp; classify correctness, freshness, availability, security, or performance.
2. Determine affected users, metrics, and downstream assets using lineage.
3. For suspected exposure or incorrect decisions, contain distribution immediately.
4. Freeze unnecessary changes and preserve logs/query evidence.
5. Compare recent deployments and upstream changes.
6. Localize failure stage with telemetry and reconciliation.
7. Choose rollback, rerun, failover, correction, or temporary suppression based on risk.
8. Validate restored data independently before reopening access.
9. Communicate status, known impact, and data validity window.
10. Perform root-cause analysis and add durable detection/prevention controls.

## Decision points
Prefer rollback when a recent reversible change is strongly implicated. Rerun only when inputs and idempotency are understood. Suppress a dashboard rather than knowingly publish incorrect data.

## Common failure patterns
Blind reruns, deleting evidence, declaring recovery when refresh merely succeeds, no stakeholder validity notice, and treating source defects as dashboard defects.

## Verification
Prove data correctness/freshness, security, and performance for affected paths and verify user-facing status is updated.

## Expected output
Restored trusted service, incident timeline, impact statement, root cause, corrective actions, and regression controls.

## Stop conditions
Escalate immediately for suspected unauthorized disclosure, destructive remediation, missing production permissions, or uncertain data validity with material business impact.