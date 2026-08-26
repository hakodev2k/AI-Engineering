# Cache Key Rules

## Purpose
Prevent content corruption, leakage, and cache fragmentation caused by incorrect cache identity.

## Scope
Applies to URL normalization, query parameters, headers, cookies, device variants, localization, and custom edge keys.

## MUST
- Every cache-key component MUST correspond to a representation-changing input.
- Ignored query parameters, headers, or cookies MUST be proven irrelevant to response content and authorization.
- URL normalization MUST preserve application routing semantics.
- Variant behavior MUST be deterministic across edge locations.
- Cache-key changes MUST be evaluated for collision risk and cardinality growth.

## MUST NOT
- MUST NOT exclude identity, tenant, entitlement, locale, or experiment dimensions when they affect returned content.
- MUST NOT include unbounded request values by default.
- MUST NOT normalize distinct application resources into one key without contract-level evidence.

## SHOULD
- Strip known tracking parameters when they do not alter representation.
- Keep keys minimal while preserving correctness.
- Document custom key transformations near their configuration source.

## Exceptions
Any deliberate collision or unusual normalization requires documented evidence, blast radius, rollback method, and approval from the service owner.

## Verification
Use paired requests that vary one dimension at a time; inspect cache-status and object identity; test authenticated and anonymous paths; monitor key cardinality, hit ratio, and unexpected cross-user responses.