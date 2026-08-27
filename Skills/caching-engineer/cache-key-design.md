# Cache Key Design

## Purpose
Create stable, collision-resistant, bounded cache keys that preserve tenant, authorization, version, and query semantics.

## When to use
Use when adding cached objects, changing request dimensions, diagnosing collisions, low hit rates, or cross-tenant contamination.

## Inputs
Resource identity, request parameters, tenant and locale dimensions, authorization semantics, schema/version information, expected cardinality.

## Context to inspect
Inspect canonical identifiers, serializers, current key conventions, namespace ownership, maximum key lengths, hashing behavior, and backend limits.

## Core knowledge
Keys define cache identity. Every dimension that changes the cached representation must be represented directly or through a safe canonical digest. Excess dimensions destroy reuse; missing dimensions corrupt correctness. Namespaces and explicit versions make migrations controllable.

## Procedure
1. Enumerate all inputs that can alter the representation.
2. Separate identity dimensions from irrelevant transport details.
3. Canonicalize ordering, case, encoding, and optional values.
4. Include tenant/security scope where representations differ.
5. Prefix with domain and schema/version namespace.
6. Bound key length; hash large canonical parameter sets with a strong deterministic digest.
7. Estimate cardinality and memory overhead.
8. Define migration behavior for key-version changes.
9. Test equivalent inputs produce identical keys and distinct representations do not collide.
10. Instrument top namespaces and cardinality where supported.

## Decision points
Use readable keys for operability when length and sensitivity permit. Use digests for large or sensitive parameter sets, while retaining a readable namespace prefix. Do not embed secrets or raw PII.

## Common failure patterns
Omitting tenant, locale, permission, model version, or query dimensions; nondeterministic JSON; timestamps in keys; accidental high cardinality; raw user input; changing key format without migration.

## Verification
Property-test determinism and separation, inspect representative production-like keys, verify backend limits, and confirm no sensitive material appears in telemetry.

## Expected output
A documented key schema with examples, cardinality estimate, versioning strategy, and tests.

## Stop conditions
Stop when representation identity or authorization scope cannot be determined reliably.