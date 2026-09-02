# Production Troubleshooting

## Purpose
Diagnose production knowledge-graph failures systematically across ingestion, identity, semantics, queries, storage, replication, security, and infrastructure while minimizing further impact.

## When to use
Use for incorrect answers, missing/duplicate entities, stale knowledge, slow queries, failed writes, graph corruption symptoms, replication issues, or unexplained resource saturation.

## Inputs
Incident description, timestamps, logs, metrics, traces, slow-query plans, deployment history, graph samples, ingestion checkpoints, source status, and recent schema changes.

## Preconditions
Establish incident severity, preserve evidence, and determine which production actions are authorized. Prefer read-only investigation until the failure mode is understood.

## Context to inspect
Recent deployments and migrations, ingestion lag, rejected records, entity-resolution changes, indexes, transaction errors, replication lag, high-degree nodes, memory/disk pressure, security policy changes, and source-system incidents.

## Core knowledge
Graph incidents often cross layers. A missing answer may come from source omission, failed entity linking, ingestion lag, schema mismatch, authorization filtering, stale indexes, or query semantics. Senior troubleshooting follows evidence through the full fact lifecycle rather than patching the visible query.

## Procedure
1. Define the user-visible symptom and affected scope.
2. Establish the last known good time and recent changes.
3. Check service health, saturation, and dependency status.
4. Trace representative facts from source through ingestion to graph storage.
5. Validate canonical identity and relevant relationships.
6. Compare expected and actual query patterns and execution plans.
7. Check schema, ontology, index, and authorization changes.
8. Inspect replication, cache, and derived-index freshness.
9. Form one falsifiable hypothesis at a time.
10. Reproduce safely using a narrow data slice when possible.
11. Mitigate with the least destructive reversible action.
12. Verify user-visible recovery and data invariants.
13. Identify root cause, contributing conditions, and detection gaps.
14. Add regression tests, monitors, or runbook improvements.

## Decision points
Rollback when a recent reversible change strongly correlates with broad impact. Repair data only after identifying corruption scope and source-of-truth semantics. Rebuild indexes or derived artifacts before rewriting canonical graph facts when evidence points to stale derivatives.

## Common failure patterns
Deleting suspicious graph data before preserving evidence; restarting systems without diagnosis; assuming a query defect when ingestion is stale; repairing symptoms with one-off manual mutations; and declaring recovery based only on infrastructure metrics.

## Verification
Confirm representative user queries, ingestion freshness, graph invariants, identity counts, latency/error SLOs, and absence of recurrence during an observation window. Record evidence distinguishing mitigation from verified root-cause resolution.

## Expected output
Incident timeline, evidence, root cause, mitigation, verified recovery, corrective actions, and regression protections.

## Stop conditions
Stop and escalate when repair is destructive, regulatory or security impact is suspected, production privileges are insufficient, or evidence indicates corruption beyond a safely understood boundary.