# Deadlock Investigation

## Purpose
Find the competing transactions and resource cycle that caused a deadlock, then remove or safely reduce the conflict.

## When to use
Use when the database reports deadlock victims, intermittent transaction aborts, or concurrency failures consistent with cyclic waits.

## Inputs
Deadlock graphs or reports, SQL, plans, transaction code, indexes, isolation settings, timestamps, and workload context.

## Context to inspect
Inspect every participant in the deadlock, resource acquisition order, lock modes, transaction duration, access paths, and retry behavior.

## Core knowledge
A deadlock is a cycle of dependencies, not simply a slow lock. The victim is chosen to break the cycle; fixing only the victim query can miss the real cause.

## Procedure
1. Capture the engine's deadlock evidence.
2. Identify all sessions, statements, and locked resources.
3. Reconstruct the wait-for cycle.
4. Map statements back to application transactions.
5. Compare resource access order across participants.
6. Check whether scans or poor indexes enlarge lock footprints.
7. Shorten transaction scope and remove unnecessary work.
8. Align access order where possible.
9. Evaluate isolation or row-versioning changes carefully.
10. Add bounded retry handling for unavoidable deadlocks.

## Decision points
Prefer eliminating the cycle over masking it with retries. Use retries as resilience for residual concurrency, not as the sole remediation for systematic deadlocks.

## Common failure patterns
Looking only at the victim, killing sessions manually without root cause, adding broad indexes blindly, and increasing timeouts for a cyclic wait.

## Verification
Reproduce concurrent access where possible, confirm the cycle no longer occurs, and monitor deadlock frequency after deployment.

## Expected output
A deadlock root-cause report, transaction or index remediation, retry guidance, and verification evidence.

## Stop conditions
Escalate if diagnostic evidence is unavailable or remediation requires changing business serialization semantics.