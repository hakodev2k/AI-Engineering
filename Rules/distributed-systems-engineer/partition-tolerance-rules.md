# Partition Tolerance Rules

## Purpose
Define safe behavior when network communication is delayed, lost, or asymmetric.

## Scope
Cross-node and cross-region communication.

## MUST
- Every critical distributed workflow MUST define behavior during network partitions.
- Availability-versus-consistency trade-offs MUST be explicit for each partition-sensitive operation.
- Recovery after partition healing MUST reconcile divergent state deterministically.

## MUST NOT
- MUST NOT treat timeout as proof that an operation failed.
- MUST NOT permit split-brain writes where invariants require a single authority.

## SHOULD
- Partition simulations SHOULD be part of resilience testing for critical paths.

## Exceptions
Temporary degraded modes require bounded duration, monitoring, and recovery criteria.

## Verification
Review fault-injection results, reconciliation tests, timeout semantics, and partition runbooks.