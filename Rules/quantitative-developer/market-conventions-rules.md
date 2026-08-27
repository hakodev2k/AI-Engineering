# Market Conventions Rules

## Purpose
Ensure instrument calculations reflect the actual conventions of the markets they represent.

## Scope
Applies to prices, yields, curves, derivatives, FX, rates, futures, options, and instrument metadata.

## MUST
- Day-count, compounding, settlement, quote, currency, multiplier, tick, expiry, exercise, and holiday conventions MUST be explicit where applicable.
- Instrument identifiers MUST be resolved through controlled reference data with effective dates.
- Contract rolls, expiries, corporate actions, and lifecycle events MUST be modeled consistently with the intended use.
- Conversion between conventions MUST be tested against authoritative examples or independent implementations.

## MUST NOT
- Similar instruments MUST NOT be assumed to share conventions without evidence.
- Hard-coded calendar dates or contract metadata MUST NOT replace maintained reference data in production.
- Unit conversions MUST NOT be implicit at API or storage boundaries.

## SHOULD
- Represent units and conventions in types or schemas where practical.
- Centralize convention logic rather than duplicate it across models.

## Exceptions
Exceptions require documented market scope, source, effective period, risk, and validation evidence.

## Verification
Inspect reference-data lineage, convention tables, boundary-date tests, independent pricing examples, instrument lifecycle tests, and reconciliation against trusted market or clearing documentation.