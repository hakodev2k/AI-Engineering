# Validation and Reconciliation

## Purpose
Prove that the migrated system represents required source truth and behavior.

## Scope
Covers record, aggregate, semantic, application, and cross-system reconciliation.

## MUST
- Validation MUST be defined before execution with explicit pass, fail, and investigation thresholds.
- Reconciliation MUST account for legitimate changes occurring during the comparison window.
- Material discrepancies MUST be explained, repaired, or formally accepted before source retirement.

## MUST NOT
- MUST NOT cherry-pick only successful samples.
- MUST NOT use counts as the sole validation when values, relationships, ordering, or transformations matter.

## SHOULD
- Combine deterministic whole-dataset checks with risk-based sampling of complex transformations.
- Make reconciliation queries repeatable and version controlled.

## Exceptions
Statistical validation may replace exhaustive comparison for impractically large datasets only with justified confidence bounds and risk approval.

## Verification
Review reconciliation outputs, invariant checks, sampling method, discrepancy tickets, application tests, and acceptance sign-off.