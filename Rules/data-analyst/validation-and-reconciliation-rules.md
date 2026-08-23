# Validation and Reconciliation Rules

## Purpose
Detect analytical defects before results reach decision makers.

## Scope
All material analyses, reports, dashboards, and recurring metrics.

## MUST
- Reconcile key totals against an independent trusted reference when available.
- Validate representative records end to end from source to output.
- Test boundary conditions, null handling, duplicate handling, and filter logic.
- Compare new results with historical ranges and explain material discontinuities.

## MUST NOT
- MUST NOT approve an analysis using only visual plausibility.
- MUST NOT treat agreement with expectations as sufficient validation.

## SHOULD
- Use independent queries or reviewers for high-impact outputs.

## Exceptions
Where no independent reference exists, use multiple internal consistency checks and document the limitation.

## Verification
Inspect reconciliation tables, test cases, historical comparisons, reviewer evidence, and unresolved discrepancies.