# Routing

## Purpose
Ensure gateway routing is deterministic, auditable, and safe under change.

## Scope
Host, path, header, method, weighted, regional, and service routing.

## MUST
- Every route MUST have an unambiguous match condition, intended upstream, owner, and precedence.
- Overlapping routes MUST have deterministic precedence validated before deployment.
- Route changes MUST preserve required public contracts or use an approved migration plan.
- Weighted or canary routes MUST define success metrics and a rollback trigger.

## MUST NOT
- MUST NOT rely on undocumented route ordering.
- MUST NOT route production traffic to an unverified environment or endpoint.
- MUST NOT silently broaden a route match that increases exposed surface area.

## SHOULD
- Route tables SHOULD be generated or linted for conflicts.
- High-risk routing changes SHOULD be staged with limited traffic first.

## Exceptions
Emergency reroutes require incident context, accountable approval, bounded duration, and post-change verification.

## Verification
Use configuration linting, route-resolution tests, synthetic requests, upstream identity checks, traffic metrics, and diff review.