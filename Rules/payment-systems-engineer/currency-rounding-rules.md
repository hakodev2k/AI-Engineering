# Currency and Rounding Rules

## Purpose
Prevent monetary corruption caused by invalid precision, currency mixing, or inconsistent rounding.

## Scope
Pricing, authorization, capture, refund, fee, tax, settlement, conversion, and reporting calculations.

## MUST
- Monetary values MUST carry an explicit ISO currency or equivalent stable currency identifier.
- Amount precision MUST follow the currency and provider contract; unsupported fractional precision MUST be rejected before financial submission.
- Rounding mode and rounding point MUST be defined for every calculation that can change a financial result.
- Currency conversion MUST preserve source amount, source currency, target amount, target currency, rate, rate source, and effective timestamp.
- Aggregations MUST avoid double rounding and MUST reconcile to posted financial entries.

## MUST NOT
- MUST NOT add or compare amounts of different currencies without an explicit conversion step.
- MUST NOT use binary floating point as the authoritative representation of money.
- MUST NOT infer currency from locale or UI formatting.

## SHOULD
- Internal APIs SHOULD use minor units or precise decimal representations consistently.

## Exceptions
Exceptions require documented currency semantics and test evidence.

## Verification
Run precision, zero-decimal, multi-currency, conversion, aggregation, and boundary tests against provider specifications.