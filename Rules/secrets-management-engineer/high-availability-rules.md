# High Availability Rules

## Purpose
Keep credential services available without weakening security boundaries during failures.

## Scope
Secret stores, issuers, replicas, dependencies, network paths, failover, and maintenance.

## MUST
- Availability targets MUST be defined from dependent-service requirements and credential caching behavior.
- Critical secret services MUST avoid unplanned single points of failure across compute, storage, identity, and network dependencies.
- Failover MUST preserve authorization, audit, encryption, and consistency requirements.
- Maintenance and failover procedures MUST be tested before they are relied upon in production.

## MUST NOT
- Availability workarounds MUST NOT bypass authentication or expose bulk secret material.
- Replicas MUST NOT use weaker protection than the primary system.
- Stale replicas MUST NOT issue or serve credentials when doing so violates consistency or revocation requirements.

## SHOULD
- Design clients for bounded retries, timeouts, and safe caching appropriate to credential lifetime.
- Capacity SHOULD include rotation bursts and recovery scenarios.

## Exceptions
Single-region or single-instance designs require explicit business acceptance, recovery plan, and documented impact.

## Verification
Review architecture, dependency maps, SLOs, failover tests, replica policy, client behavior, capacity evidence, and recovery exercises.