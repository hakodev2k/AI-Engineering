# Change Correlation and Rollback

## Purpose
Evaluate whether a recent change caused or amplified an incident and execute a safe rollback when evidence and risk justify it.

## When to use
Use when failures correlate with deployments, configuration, infrastructure, schema, feature flags, dependency versions, or policy changes.

## Inputs
Change history, deployment metadata, feature flags, configuration diffs, incident timeline, rollback procedure, compatibility constraints, and telemetry.

## Context to inspect
Inspect all relevant change planes, not only application deployments. Review migrations, caches, queues, protocol compatibility, and rollback dependencies.

## Core knowledge
Temporal correlation raises a hypothesis but does not prove causality. Rollback is a mitigation with its own failure modes, especially when state or schemas are not backward compatible.

## Procedure
1. Establish the first confirmed failure time.
2. Enumerate changes before and during that window.
3. Rank changes by affected path and symptom fit.
4. Compare changed and unchanged populations when possible.
5. Validate rollback prerequisites and state compatibility.
6. Estimate rollback blast radius and recovery time.
7. Choose rollback, roll-forward, feature disablement, or targeted configuration reversal.
8. Execute one controlled change with an owner and rollback-of-rollback plan.
9. Observe agreed health signals.
10. Record whether recovery supports or weakens the causal hypothesis.

## Decision points
Prefer rollback for recent reversible changes with strong correlation and safe compatibility. Prefer roll-forward when rollback would corrupt state, violate schema compatibility, or reintroduce known defects.

## Common failure patterns
Blind rollback, ignoring database migrations, reverting multiple changes together, treating recovery as proof of root cause, and failing to verify stale configuration or caches.

## Verification
Confirm service health, data integrity, error rates, latency, and customer impact return toward baseline after the change.

## Expected output
A documented change assessment and, when executed, a verified rollback or alternative mitigation result.

## Stop conditions
Require escalation for irreversible migrations, uncertain data compatibility, destructive rollback steps, or changes owned by an unavailable external party.