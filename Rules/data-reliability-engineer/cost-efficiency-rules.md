# Cost Efficiency Rules

## Purpose
Control data-platform cost without trading away correctness, reliability, or recoverability.

## Scope
Compute, storage, network transfer, orchestration, retention, replication, and query execution.

## MUST
- Measure material cost drivers before proposing optimizations.
- Evaluate cost changes against reliability, latency, recovery, and data-quality requirements.
- Set ownership and review thresholds for unexpectedly expensive workloads.
- Estimate cost impact for large backfills, migrations, retention changes, and new high-volume pipelines before execution.

## MUST NOT
- Reduce redundancy, retention, observability, or recovery capability solely to meet a cost target without explicit risk approval.
- Claim savings from theoretical estimates when production billing or usage evidence is available.
- Allow runaway queries or jobs to consume unbounded shared resources without controls.

## SHOULD
- Prefer workload-aware scheduling, pruning, compression, and right-sizing when supported by evidence.
- Track unit economics such as cost per processed record, query, or data product where meaningful.

## Exceptions
Intentional temporary overspend requires business justification, bounded duration, owner, and review criteria.

## Verification
Inspect billing data, workload metrics, resource settings, retention configuration, before-and-after measurements, and forecast assumptions.