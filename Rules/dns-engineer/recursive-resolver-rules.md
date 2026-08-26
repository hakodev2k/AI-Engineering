# Recursive Resolver Rules

## Purpose
Operate recursive DNS resolvers safely and predictably.

## Scope
Enterprise, service, and public recursive resolvers.

## MUST
- Resolver access MUST be restricted to intended clients unless the service is deliberately public.
- Cache, timeout, retry, and upstream behavior MUST be defined and monitored.
- Resolver capacity MUST account for cache-miss storms and upstream degradation.

## MUST NOT
- MUST NOT operate an accidental open resolver.
- MUST NOT disable validation or protective controls merely to bypass resolution failures.

## SHOULD
- Resolver fleets SHOULD isolate failure domains and support graceful upstream failover.
- Configuration SHOULD be reproducible and version controlled.

## Exceptions
Exceptions require security review, operational evidence, bounded scope, and expiry or re-review.

## Verification
Test recursion from allowed and denied networks, inspect configuration, measure cache behavior, and review resolver metrics.