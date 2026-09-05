# Redundancy and Failover Rules

## Purpose
Ensure critical network paths and services survive expected component failures without improvised recovery.

## Scope
Redundant links, gateways, network appliances, regions, and shared network services.

## MUST
- Critical connectivity MUST identify redundant paths or an explicitly accepted single point of failure.
- Failover behavior MUST be tested under representative failure conditions.
- Redundant components MUST not depend on the same hidden failure domain when independence is required.
- Recovery procedures MUST define how normal routing or topology is restored after failover.

## MUST NOT
- MUST NOT claim redundancy solely because two components exist.
- MUST NOT leave failover paths unmonitored or untested.
- MUST NOT perform failover exercises without bounded scope and recovery criteria.

## SHOULD
- Exercise failover periodically for high-criticality paths.
- Prefer automatic failover when its behavior is deterministic and observable.

## Exceptions
Exceptions require documented business impact, compensating controls, and approval.

## Verification
Review topology, failure-domain mapping, failover tests, monitoring, and recovery evidence.