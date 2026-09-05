# Amount and Currency Rules

## Purpose
Prevent monetary corruption caused by floating-point arithmetic, rounding ambiguity, or incorrect currency assumptions.

## Scope
Amounts, fees, taxes, exchange rates, refunds, settlements, and all persisted monetary values.

## MUST
- Monetary values MUST use integer minor units or an exact decimal representation appropriate to the currency.
- Currency MUST be explicit whenever an amount crosses a system or persistence boundary.
- Rounding mode and scale MUST be defined for every calculation that can lose precision.
- Currency metadata MUST account for currencies whose minor-unit conventions differ.
- Comparisons and reconciliation MUST use the same normalization rules as posting.

## MUST NOT
- MUST NOT use binary floating-point values as authoritative monetary amounts.
- MUST NOT infer currency solely from locale.
- MUST NOT silently truncate or round amounts at inconsistent layers.

## SHOULD
- Centralize monetary arithmetic and formatting rules.

## Exceptions
Require domain justification, exactness analysis, tests, and approval.

## Verification
Use boundary-value tests, multi-currency tests, rounding tests, and persistence inspection.