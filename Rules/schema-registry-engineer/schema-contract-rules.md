# Schema Contract Rules

## Purpose
Define stable, enforceable contracts for serialized data exchanged between producers and consumers.

## Scope
Registered schemas, field semantics, requiredness, defaults, logical types, metadata, and consumer-visible behavior.

## MUST
- Every production schema MUST define field names, types, nullability, defaults, and semantic meaning.
- Contract changes MUST identify affected producers and consumers before release.
- Required fields MUST have explicit introduction and migration strategy.
- Logical types, units, timestamp semantics, and identifier formats MUST be documented.
- Schema metadata MUST identify owner and lifecycle status.

## MUST NOT
- Field meaning MUST NOT change silently while retaining the same field identity.
- Defaults MUST NOT conceal invalid or missing data without documented semantics.
- Undocumented out-of-band conventions MUST NOT be treated as part of the contract.

## SHOULD
- Contracts SHOULD be machine-validated in CI.
- Semantics SHOULD be concise enough for independent producer and consumer teams to interpret consistently.

## Exceptions
Exceptions require documented consumer impact, rationale, migration evidence, and owner approval.

## Verification
Inspect registered schema definitions, metadata, contract tests, and producer/consumer compatibility evidence.