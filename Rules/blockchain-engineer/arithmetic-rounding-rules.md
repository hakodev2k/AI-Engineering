# Arithmetic and Rounding

## Purpose
Keep fixed-point arithmetic, conversions, and rounding economically correct and overflow-safe.

## Scope
Prices, ratios, shares, fees, interest, percentages, decimals, and integer arithmetic.

## MUST
- Specify units, scale factors, precision, and rounding direction for every economic calculation.
- Analyze intermediate-value bounds, not only final-value bounds.
- Test zero, one-unit, maximum, near-overflow, and repeated-rounding cases.
- Ensure rounding cannot be profitably amplified through repeated operations.
- Preserve invariants across conversions between assets, shares, and accounting units.

## MUST NOT
- Use floating-point arithmetic for consensus-critical deterministic accounting unless the target platform explicitly guarantees suitable semantics.
- Mix token decimals or scales implicitly.
- Round in an unspecified direction when value transfer is affected.

## SHOULD
- Centralize reviewed fixed-point primitives and minimize repeated conversions.

## Exceptions
Alternative numeric representations require deterministic semantics, bounded error analysis, and tests.

## Verification
Use property tests, boundary vectors, differential calculations, invariant checks, and manual review of units and rounding direction.