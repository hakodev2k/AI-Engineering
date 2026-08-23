# Data Grain and Join Rules

## Purpose
Prevent analytical errors caused by mismatched grain and join cardinality.

## Scope
All datasets combined across tables, files, APIs, or semantic layers.

## MUST
- State the intended grain of every intermediate and final dataset.
- Validate join cardinality before aggregating measures.
- Pre-aggregate or deduplicate only with an explicit business rule.
- Reconcile row counts and key totals before and after material joins.

## MUST NOT
- MUST NOT join facts at incompatible grains without controlling duplication.
- MUST NOT assume identifier uniqueness without evidence.

## SHOULD
- Use assertions for expected key uniqueness and relationship cardinality in recurring pipelines.

## Exceptions
Intentional fan-out analysis is allowed when multiplication is the analytical objective and is documented.

## Verification
Inspect uniqueness checks, row-count deltas, duplicated-key diagnostics, and before/after measure totals.