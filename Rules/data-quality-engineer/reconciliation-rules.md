# Reconciliation Rules
## Purpose
Prove that data movement and transformation preserve expected populations and values.
## Scope
Source-target counts, control totals, financial totals, checksums, and transformation balances.
## MUST
- Critical transfers MUST define reconciliation keys, windows, tolerances, and authoritative sides.
- Reconciliation MUST account for legitimate filtering, late arrivals, duplicates, and temporal cutoffs.
- Unexplained material differences MUST block trust designation or be explicitly accepted by an accountable owner.
## MUST NOT
- MUST NOT reconcile only total row counts when value loss or duplication could offset numerically.
- MUST NOT discard reconciliation differences without traceable disposition.
## SHOULD
- Independent control totals SHOULD be used for high-impact measures.
## Exceptions
Approximate reconciliation requires quantified error bounds and suitability evidence.
## Verification
Recompute controls, inspect discrepancy samples, timing assumptions, tolerances, and disposition records.