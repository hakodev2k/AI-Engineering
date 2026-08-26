# Currency and Money Precision

## Purpose
Represent and calculate monetary values without rounding drift, currency confusion, or precision defects.

## When to use
Use for pricing, payments, fees, taxes, refunds, balances, FX, settlement, and reporting.

## Inputs
Supported currencies, provider formats, rounding rules, business calculations, accounting requirements.

## Context to inspect
Amount types, database columns, serialization, calculations, UI formatting, provider adapters, tests.

## Core knowledge
Binary floating point is inappropriate for authoritative money calculations. Currency minor-unit exponents vary. Some business calculations require higher intermediate precision. Rounding mode and point of rounding are business rules, not implementation trivia.

## Procedure
1. Inventory every money representation across boundaries.
2. Define a canonical Money type containing amount and currency.
3. Choose integer minor units or fixed/exact decimal based on domain needs.
4. Centralize currency metadata.
5. Define rounding mode and when rounding occurs.
6. Preserve sufficient intermediate precision for fees/FX.
7. Reject arithmetic across currencies unless an explicit conversion exists.
8. Validate provider conversions at adapters.
9. Define serialization formats without locale ambiguity.
10. Test zero, negative where legal, maximum, fractional, and unusual-exponent currencies.
11. Reconcile aggregate calculations against authoritative statements.

## Decision points
Integer minor units simplify many payment APIs; exact decimal is often preferable where rates, taxes, or sub-minor precision are required.

## Common failure patterns
Using float/double, assuming every currency has two decimals, rounding each line incorrectly, implicit currency conversion, and locale-dependent parsing.

## Verification
Property-test arithmetic invariants, compare provider round trips, test currency metadata, and verify totals under documented rounding rules.

## Expected output
A consistent money model and calculation policy with explicit precision, currency, and rounding semantics.

## Stop conditions
Escalate unresolved financial rounding or FX accounting rules.