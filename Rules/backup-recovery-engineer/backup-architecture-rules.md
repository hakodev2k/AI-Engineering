# Backup Architecture

## Purpose
Ensure protection architecture survives the failures it is intended to recover from.

## Scope
Backup control planes, repositories, agents, proxies, networks, catalogs, metadata, and recovery infrastructure.

## MUST
- Architecture MUST remove single points of failure that can defeat approved recovery objectives.
- Backup data, metadata, credentials, and orchestration dependencies MUST have documented failure domains.
- At least one recovery path MUST remain usable when the primary production identity or management plane is unavailable where cyber recovery is in scope.
- Capacity and throughput assumptions MUST be validated against restore, not only ingest, requirements.

## MUST NOT
- MUST NOT place all recoverable copies in the same administrative or physical failure domain as production.
- MUST NOT depend on undocumented bootstrap components during disaster recovery.
- MUST NOT treat replication alone as backup when destructive changes can propagate.

## SHOULD
- Architecture SHOULD favor simple, testable recovery paths over unnecessary component complexity.
- Critical metadata SHOULD have independent protection and documented reconstruction procedures.

## Exceptions
Deviations require failure-mode analysis, residual-risk acceptance, evidence of compensating controls, and an owner.

## Verification
Inspect architecture diagrams, identity boundaries, repository placement, network paths, dependency inventories, capacity tests, and disaster-recovery exercise evidence.