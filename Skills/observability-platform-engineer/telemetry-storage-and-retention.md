# Telemetry Storage and Retention

## Purpose
Design storage and retention policies that preserve diagnostic value while meeting performance, compliance, and cost constraints.

## When to use
Use when sizing telemetry backends, changing retention, creating hot/warm/cold tiers, or controlling storage growth.

## Inputs
Signal volumes, query patterns, legal requirements, incident horizons, storage pricing, recovery needs.

## Context to inspect
Inspect ingestion growth, compression, index size, query age distribution, retention jobs, replicas, and backup policy.

## Core knowledge
Understand index/storage amplification, compaction, object storage, lifecycle policies, replication, retention by signal value, and restore trade-offs.

## Procedure
1. Classify telemetry by diagnostic, audit, and compliance value.
2. Measure current ingestion and growth by tenant and signal.
3. Analyze how far back operators actually query.
4. Define retention tiers and deletion guarantees.
5. Separate searchable hot data from cheaper archival data where justified.
6. Model capacity including replication and index overhead.
7. Define restore workflows for archived telemetry.
8. Add quota and growth alerts.
9. Revisit policy as traffic and regulations change.

## Decision points
Keep longer retention only when its diagnostic or compliance value exceeds cost. Prefer object storage for archival workloads that tolerate restore/query latency.

## Common failure patterns
Uniform retention for all signals, hidden index amplification, no tenant quotas, archival with no tested restore, and indefinite audit retention without policy.

## Verification
Validate lifecycle transitions, deletion, representative old-data queries, capacity forecasts, and restore tests.

## Expected output
A storage and retention plan with capacity, cost, compliance, and restore evidence.

## Stop conditions
Stop if mandatory retention or deletion obligations are unresolved.