# Delegation Rules

## Purpose
Prevent broken or insecure DNS delegation.

## Scope
Parent-child delegations, NS records, glue, and registrar/registry coordination.

## MUST
- Parent and child NS sets MUST be intentionally coordinated and validated after change.
- Required glue MUST be correct and reachable before relying on an in-bailiwick nameserver.
- Delegation changes MUST account for TTLs, registrar workflow, and rollback feasibility.

## MUST NOT
- MUST NOT remove the last working delegation path during migration.
- MUST NOT assume child-zone correctness proves parent delegation correctness.

## SHOULD
- Delegation migrations SHOULD overlap old and new authoritative capacity long enough for caches to converge.

## Exceptions
Compressed migration windows require explicit risk acceptance and enhanced monitoring.

## Verification
Trace resolution from the root, compare parent and child NS data, validate glue, and test all delegated servers externally.