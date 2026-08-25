# Storage Testing and Failure Injection

## Purpose
Validate storage correctness and resilience by testing realistic failures, degraded states, recovery, and workload behavior before incidents reveal design assumptions.

## When to use
Use for new platforms, major changes, DR readiness, HA validation, or after incident lessons.

## Inputs
Architecture, failure model, SLOs, redundancy, recovery procedures, workload profile, and test environment.

## Preconditions
Use isolated or explicitly approved environments; establish blast-radius controls and recovery checkpoints.

## Context to inspect
Failure domains, quorum/fencing, network paths, devices, replication, clients, backups, monitoring, and automation.

## Core knowledge
Happy-path benchmarks do not prove resilience. Failures may cause latency amplification, retry storms, split brain, stale reads, rebuild saturation, or hidden data loss even when service appears available.

## Procedure
1. Enumerate credible component and dependency failures.
2. Rank by impact and uncertainty.
3. Define invariants and expected behavior.
4. Establish abort conditions.
5. Apply one controlled fault at a time.
6. Observe client correctness, latency, and backend state.
7. Validate alerts and operator procedures.
8. Recover and reconcile state.
9. Verify integrity and redundancy.
10. Record deviations and remediate before broader tests.

## Decision points
Prefer lower-blast-radius experiments first. Production failure injection is appropriate only with mature safeguards, explicit approval, and proven recovery.

## Common failure patterns
Testing only component health, no client validation, multiple simultaneous faults without baseline, missing fencing checks, and ending tests before rebuild/recovery completes.

## Verification
Expected invariants hold, SLO behavior is measured, alarms fire correctly, recovery completes, and integrity checks show no loss beyond stated guarantees.

## Expected output
A failure-test matrix with hypotheses, evidence, observed behavior, gaps, and remediation owners.

## Stop conditions
Abort immediately on unexpected integrity risk, loss of recovery path, uncontrolled blast radius, or failure beyond the approved experiment boundary.
