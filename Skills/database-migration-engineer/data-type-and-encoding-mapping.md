# Data Type and Encoding Mapping

## Purpose
Preserve exact data meaning across engines, versions, character sets, and storage representations.

## When to use
Use for heterogeneous migrations or whenever target type, collation, timezone, or encoding semantics differ.

## Inputs
Column metadata, data profiles, target type system, collations, character sets, application expectations, and sample edge values.

## Core knowledge
Type equivalence requires semantic comparison: range, precision, scale, rounding, timezone, Unicode behavior, collation, binary representation, nullability, and serialization.

## Procedure
1. Enumerate source types and actual value ranges.
2. Define explicit target mappings.
3. Test boundary values and malformed values.
4. Validate decimal precision and rounding.
5. Validate timestamps, offsets, daylight-saving behavior, and sentinel dates.
6. Validate Unicode normalization, collation, case sensitivity, and sorting.
7. Validate binary, JSON, UUID, spatial, and large-object handling.
8. Document lossy conversions and reject them unless approved.
9. Automate conversion tests.
10. Include mappings in reconciliation checks.

## Decision points
Choose wider target types when uncertainty is material and storage cost is acceptable; normalize only when consumers explicitly support changed semantics.

## Common failure patterns
Timezone stripping, decimal rounding, Unicode corruption, collation changes, integer overflow, and empty-string/null conflation.

## Verification
Round-trip representative and boundary values and compare canonical representations.

## Expected output
An explicit mapping specification and automated edge-case tests.

## Stop conditions
Stop when any critical mapping is lossy without documented acceptance.