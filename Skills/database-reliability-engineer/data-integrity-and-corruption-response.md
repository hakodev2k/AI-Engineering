# Data Integrity and Corruption Response

## Purpose
Detect, contain, assess, and recover from suspected database corruption or integrity violations.

## When to use
Use for checksum errors, impossible records, failed consistency checks, storage faults, or unexplained divergence.

## Inputs
Integrity errors, logs, backups, replication state, checksums, schema constraints, and recent changes.

## Context to inspect
Affected objects, storage health, replicas, backup history, application writes, maintenance events, and engine diagnostics.

## Core knowledge
Corruption response prioritizes containment and evidence. Repair commands can destroy recoverable evidence or propagate damage if used prematurely.

## Procedure
1. Treat credible corruption signals as high severity.
2. Stop risky maintenance and unnecessary writes when justified.
3. Preserve logs, snapshots, and affected copies.
4. Determine scope with supported consistency checks.
5. Check replicas and backups for independent clean copies.
6. Identify hardware, software, or application causes.
7. Choose restore, page/object recovery, rebuild, or vendor-supported repair.
8. Validate logical and physical consistency.
9. Reconcile missing transactions if required.
10. Monitor for recurrence.

## Decision points
Prefer recovery from known-good copies over destructive repair when feasible. Isolate replicas if corruption may replicate.

## Common failure patterns
Running repair immediately, assuming replicas are clean, overwriting evidence, restoring without validating backup age, and ignoring logical corruption.

## Verification
Run supported integrity checks, application invariants, reconciliation, and post-recovery monitoring.

## Expected output
Contained incident, documented scope and cause, verified recovery, and prevention actions.

## Stop conditions
Escalate before destructive repair, when clean recovery points are uncertain, or when regulated data may be affected.