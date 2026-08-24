# Availability and Resilience Rules

## Purpose
Keep identity controls dependable without creating insecure fail-open behavior.

## Scope
Identity providers, directories, policy engines, provisioning pipelines, federation endpoints, key services, and recovery dependencies.

## MUST
- Critical identity services MUST have documented availability objectives, dependencies, failure behavior, and recovery procedures.
- Failover MUST preserve required authentication and authorization guarantees.
- Capacity and dependency risks MUST be tested under realistic peak and degraded conditions.
- Recovery procedures MUST include validation that restored identity state is current and trustworthy.

## MUST NOT
- MUST NOT configure protected systems to fail open merely to improve availability.
- MUST NOT assume provider redundancy eliminates application-side identity failure modes.
- MUST NOT perform untested production failover changes without required approval.

## SHOULD
- Prefer redundant trust paths, cached non-sensitive metadata where safe, and bounded retry/backoff behavior.

## Exceptions
Reduced assurance during emergency operation requires explicit risk acceptance, scope, time limit, monitoring, and restoration criteria.

## Verification
Review SLOs, dependency maps, load tests, failover exercises, recovery evidence, and authorization behavior during outages.