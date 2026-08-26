# Rate Limiting

## Purpose
Protect services and tenants from overload and abusive request rates without creating arbitrary outages.

## Scope
Global, route, identity, tenant, client, and upstream rate controls.

## MUST
- Rate limits MUST identify the protected resource, enforcement key, window or algorithm, capacity basis, and expected rejection behavior.
- Limits MUST account for legitimate burst patterns and downstream capacity.
- Changes that can reject production traffic MUST be staged and observable.
- Rejection responses MUST follow the applicable API contract.

## MUST NOT
- MUST NOT use unbounded client-controlled values as trusted rate-limit identity.
- MUST NOT claim a limit is safe without workload or capacity evidence.
- MUST NOT silently remove protective limits during overload.

## SHOULD
- Distributed limits SHOULD define consistency expectations.
- Clients SHOULD receive standards-compatible retry information when appropriate.

## Exceptions
Emergency adjustments require operational evidence, owner, bounded duration, and rollback criteria.

## Verification
Load test representative traffic, inspect key cardinality, validate rejection semantics, compare downstream saturation metrics, and test distributed behavior.