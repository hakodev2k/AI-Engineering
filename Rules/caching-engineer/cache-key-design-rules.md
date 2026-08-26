# Cache Key Design

## Purpose
Prevent collisions, ambiguity, leakage, and unsafe key evolution.

## Scope
Keys for local, distributed, edge, and shared caches.

## MUST
- Keys MUST encode the minimum dimensions required to uniquely identify cached semantics, including tenant or authorization scope where relevant.
- Key formats MUST be deterministic and versioned when incompatible semantic changes are possible.
- Key construction MUST define normalization for case, locale, ordering, and equivalent identifiers.
- Shared key spaces MUST use collision-resistant namespaces owned by the producing component.

## MUST NOT
- Secrets, raw credentials, access tokens, or unnecessary sensitive data MUST NOT appear in cache keys.
- Unbounded attacker-controlled input MUST NOT be copied directly into keys without validation or hashing where appropriate.
- A key schema MUST NOT be changed incompatibly without an eviction, dual-read, namespace-version, or equivalent migration plan.

## SHOULD
- Keys SHOULD remain debuggable without exposing sensitive values.
- Hashing SHOULD be used when key size or sensitive identifiers make direct representation unsafe.

## Exceptions
Any deviation requires evidence that uniqueness, isolation, migration safety, and observability remain adequate.

## Verification
Inspect key builders, tests for collisions and normalization, migration plans, cache samples, and security review evidence.