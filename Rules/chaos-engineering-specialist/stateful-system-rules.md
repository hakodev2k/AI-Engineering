# Stateful System Rules

## Purpose
Protect data correctness while validating resilience of databases, queues, storage systems, and other stateful components.

## Scope
Applies to leader loss, replica failure, quorum loss, delayed replication, storage impairment, failover, and state-recovery experiments.

## MUST
- Stateful experiments MUST define correctness invariants in addition to availability expectations.
- Current backup or recovery capability MUST be verified before any experiment with credible data-loss risk.
- Quorum, fencing, replication lag, failover, and reconciliation behavior MUST be considered where applicable.
- Destructive or irreversible state mutation in production MUST require explicit human approval.

## MUST NOT
- Availability MUST NOT be treated as proof of data correctness.
- Split-brain risk MUST NOT be introduced without explicit safeguards and bounded scope.
- Replicas or backups MUST NOT be assumed recoverable without recent evidence.

## SHOULD
- Tests SHOULD validate reads and writes through failover and recovery paths.
- Invariants SHOULD be checked automatically before, during, and after injection.

## Exceptions
When full correctness verification is impractical, use documented representative invariants, limitations, recovery evidence, and reviewer approval.

## Verification
Inspect invariant checks, replication and quorum telemetry, backup or restore evidence, failover logs, reconciliation results, and approval records.