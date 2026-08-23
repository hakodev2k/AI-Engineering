# Messaging Production Incident Response

## Purpose
Diagnose and stabilize messaging incidents while preserving evidence and preventing harmful recovery actions.

## When to use
Use for lag spikes, publish failures, broker saturation, poison messages or widespread consumer errors.

## Inputs
Incident symptoms, telemetry, topology, recent changes, SLO impact and runbooks.

## Context to inspect
Ingress/egress rates, message age, consumer health, broker resources, DLQs, dependencies and deployments.

## Core knowledge
Backlog is a symptom. Determine whether ingress rose, service rate fell, partitions stalled, dependencies degraded or broker capacity failed.

## Procedure
1. Establish user impact and timeline.
2. Freeze risky changes.
3. Compare ingress and processing rates.
4. Isolate producer, broker, consumer and dependency health.
5. Mitigate the dominant constraint.
6. Preserve failed messages/evidence.
7. Recover backlog at a safe rate.
8. Reconcile outcomes and perform root-cause analysis.

## Decision points
Throttle ingress when downstream recovery capacity is limited; scale only when bottleneck evidence supports it.

## Common failure patterns
Blind replay, deleting queues, scaling into a failed dependency and changing multiple variables simultaneously.

## Verification
Confirm SLO recovery, declining message age and no hidden DLQ/data-loss growth.

## Expected output
Stabilized service plus evidence-backed incident findings.

## Stop conditions
Escalate destructive actions or uncertain data-loss scenarios.