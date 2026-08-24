# Replication Rules

## Purpose
Keep replicas trustworthy, bounded in lag, and safe for failover or read traffic.

## Scope
Synchronous and asynchronous replication, replicas, lag, topology, and promotion readiness.

## MUST
- Define acceptable replication lag and data-loss bounds per workload.
- Alert on replication breakage, divergence, and sustained lag.
- Validate replica consistency and promotion readiness before relying on a replica for recovery.
- Document topology, quorum assumptions, and failure domains.

## MUST NOT
- Do not route correctness-sensitive reads to replicas without documented consistency semantics.
- Do not promote a replica whose divergence or recovery state is unknown.

## SHOULD
- Distribute replicas across independent failure domains when availability requirements justify it.

## Exceptions
Consistency or topology exceptions require explicit risk, workload scope, and owner approval.

## Verification
Review topology, lag metrics, replica health, consistency checks, and promotion tests.