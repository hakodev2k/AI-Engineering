# Backup Monitoring and Alerting

## Purpose
Detect protection gaps early by monitoring backup freshness, coverage, integrity, capacity, and restore readiness.

## When to use
Use when operating any backup estate or improving noisy/incomplete backup alerts.

## Inputs
Backup policies, job telemetry, asset inventory, RPO targets, repository metrics, restore-test results, and on-call routing.

## Context to inspect
Inspect scheduler state, last successful recovery point, failed/skipped assets, repository capacity, log/archive continuity, replication status, and alert history.

## Core knowledge
Job success is only one signal. Effective monitoring compares actual recoverable state against policy and inventory. Alerting should be actionable and tied to risk windows.

## Procedure
1. Define protection SLOs by workload tier.
2. Monitor last valid recovery point against RPO.
3. Reconcile protected assets with authoritative inventory.
4. Alert on repeated failures, skipped jobs, broken chains, and capacity risk.
5. Monitor immutability, retention, encryption, and replication status.
6. Track restore-test freshness separately.
7. Deduplicate correlated failures and route by ownership.
8. Create dashboards for coverage and recovery readiness.
9. Review alert precision and missed incidents.
10. Escalate persistent protection gaps.

## Decision points
Page only when timely human action can prevent objective breach; use tickets for slower policy drift. Aggregate shared repository failures without hiding affected assets.

## Common failure patterns
Green jobs with stale recovery points; orphan assets; alert storms; capacity thresholds too late; no alert for disabled schedules.

## Verification
Inject controlled failures and confirm alerts fire, route correctly, contain actionable context, and clear when protection is restored.

## Expected output
Risk-oriented monitoring that exposes real recoverability gaps.

## Stop conditions
Escalate when telemetry cannot establish recoverable state or alert suppression would conceal an active RPO breach.