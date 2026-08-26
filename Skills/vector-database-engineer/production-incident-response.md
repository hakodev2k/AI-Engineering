# Production Incident Response

## Purpose
Diagnose and mitigate vector-search incidents systematically while preserving evidence and retrieval correctness.

## When to use
Use for elevated latency/errors, missing/stale results, index corruption, ingestion lag, or capacity failures.

## Inputs
Incident symptoms, timeline, dashboards, traces, logs, recent changes, topology, runbooks, and SLO impact.

## Context to inspect
Inspect deployment/model/index changes, shard/replica health, saturation, replication lag, ingestion checkpoints, filters, query mix, and external dependencies.

## Core knowledge
Mitigation precedes deep optimization during active incidents. Vector incidents may be semantic (quality/version mismatch) even when infrastructure is healthy. Preserve a timeline and distinguish correlation from causation.

## Procedure
1. Declare severity/owner and establish timeline.
2. Quantify affected tenants/queries and SLO impact.
3. Check recent changes and dependency health.
4. Split failure domain: serving, index, filtering, ingestion, embedding, or infrastructure.
5. Apply lowest-risk mitigation: rollback, traffic reduction, failover, disable expensive feature, or restore known-good configuration.
6. Preserve logs/configuration and avoid destructive evidence loss.
7. Validate mitigation with user-facing SLIs and sample retrieval.
8. Identify root cause with reproducible evidence after stabilization.
9. Add corrective actions for detection, prevention, and recovery.
10. Conduct blameless post-incident review.

## Decision points
Rollback when a recent reversible change strongly correlates with impact; fail over when node/zone health is causal; degrade nonessential retrieval features when preserving core availability is preferable.

## Common failure patterns
Changing multiple parameters simultaneously; rebuilding indexes during uncertain diagnosis; declaring recovery from CPU alone; ignoring semantic regressions; unbounded retries worsening overload; no timeline.

## Verification
Confirm SLO recovery, representative retrieval correctness, ingestion catch-up, replica/index health, and absence of hidden backlog.

## Expected output
Mitigation record, evidence-backed root cause, and prioritized corrective actions.

## Stop conditions
Escalate when destructive recovery is required, security/privacy breach is suspected, or authority/access is insufficient.