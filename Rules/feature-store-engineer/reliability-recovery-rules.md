# Reliability and Recovery Rules

## Purpose
Keep feature serving and materialization recoverable under node, store, pipeline, or region failures.

## Scope
Replication, failover, retries, checkpoints, backup, restore, and degraded-mode behavior.

## MUST
- Critical feature services MUST define availability and recovery objectives.
- Failure recovery MUST preserve feature correctness and authorization boundaries.
- Materialization jobs MUST resume safely from checkpoints or support deterministic replay.
- Backup and restore procedures MUST be tested for state that cannot be regenerated within required recovery time.
- Degraded serving behavior MUST explicitly define stale, missing, or fallback semantics.

## MUST NOT
- MUST NOT retry indefinitely or amplify outages with uncontrolled fan-out.
- MUST NOT declare recovery complete without validating representative feature reads or writes.
- MUST NOT bypass required authorization or privacy controls during failover.

## SHOULD
- Use redundancy across failure domains where service criticality requires it.
- Practice recovery for high-severity services.

## Exceptions
Reduced redundancy requires documented duration, impact, and approval.

## Verification
Review recovery tests, failover drills, checkpoint behavior, backup evidence, and incident metrics.