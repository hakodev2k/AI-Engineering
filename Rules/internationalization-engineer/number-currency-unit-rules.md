# Number, Currency, and Unit Rules

## Purpose
Ensure numeric values are displayed and interpreted according to locale without changing their business semantics.

## Scope
Applies to numbers, percentages, currencies, measurements, compact notation, and localized numeric input.

## MUST
- Numeric formatting MUST use locale-aware formatters rather than handcrafted separators or symbols.
- Currency values MUST carry an explicit currency code independent of locale.
- Monetary calculations MUST preserve required precision and rounding rules before localized presentation.
- Unit conversions MUST identify the source unit, target unit, conversion rule, and required precision.
- Localized numeric parsing MUST define accepted decimal/grouping separators and rejection behavior for ambiguous input.

## MUST NOT
- Locale MUST NOT be used to infer currency where the business transaction defines currency independently.
- Currency symbols alone MUST NOT be treated as globally unambiguous identifiers.
- Display rounding MUST NOT mutate authoritative stored values.

## SHOULD
- User preferences SHOULD control measurement systems when product semantics permit.
- Critical financial or scientific values SHOULD avoid compact notation when precision could be obscured.

## Exceptions
Exceptions require documented business semantics, precision requirements, affected locales, and verification evidence.

## Verification
Test multiple locales, negative and large values, zero, percentages, currency codes sharing symbols, precision boundaries, unit conversions, and localized numeric input.