# Reliability and Recovery Rules

## Purpose
Keep graph services recoverable under node, storage, pipeline, or regional failures.

## Scope
Replication, failover, backups, restore, retry, replay, degraded mode, and recovery objectives.

## MUST
- Critical graph services MUST define availability and recovery objectives.
- Backups MUST cover graph state that cannot be regenerated within required recovery time.
- Restore procedures MUST be tested against representative data and indexes.
- Retry behavior MUST be bounded and safe for repeated graph mutations.
- Degraded-mode behavior MUST define which reads or writes remain trustworthy.

## MUST NOT
- MUST NOT declare recovery successful without validating representative graph queries and mutations.
- MUST NOT amplify outages through uncontrolled retries or fan-out.
- MUST NOT bypass authorization or integrity controls during failover.

## SHOULD
- Use redundancy across failure domains according to service criticality.
- Practice recovery for high-severity graph domains.

## Exceptions
Reduced redundancy requires documented duration, impact, and approval.

## Verification
Inspect restore tests, failover drills, backup age, recovery metrics, and mutation replay tests.