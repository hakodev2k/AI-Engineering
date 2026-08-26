# Schema Evolution and Versioning

## Purpose
Evolve feature schemas and semantics without silently breaking models, historical datasets or serving clients.

## When to use
Use for type, shape, naming, default, category or semantic changes.

## Inputs
Current contract, proposed change, consumers, retention horizon and migration constraints.

## Context to inspect
Registry versions, model dependencies, offline tables, online schemas, serializers and deployment cadence.

## Core knowledge
Additive storage changes can still be semantically breaking. Feature versions should represent consumer-relevant behavior, not every implementation refactor.

## Procedure
1. Classify change as implementation-only, additive-compatible or breaking.
2. Enumerate active consumers and historical dependencies.
3. Define new contract/version when semantics can change outputs.
4. Provide dual computation/materialization during migration when needed.
5. Validate old and new values on representative data.
6. Migrate consumers explicitly.
7. Monitor adoption and errors.
8. Deprecate old version with owner and deadline.
9. Remove only after dependency evidence shows zero use.
10. Preserve lineage needed for old model reproducibility.

## Decision points
Version on semantic/type changes; avoid version proliferation for equivalent internal optimization. Dual-write when rollback or staggered consumer migration is required.

## Common failure patterns
In-place type changes, undocumented category remapping, deleting history early, assuming no consumers and perpetual dual writes.

## Verification
Confirm compatibility tests, consumer inventory, dual-run parity/delta expectations and successful deprecation checks.

## Expected output
A controlled feature evolution plan with explicit compatibility guarantees.

## Stop conditions
Stop destructive changes when consumer inventory or rollback path is incomplete.