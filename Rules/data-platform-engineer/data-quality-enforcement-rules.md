# Data Quality Enforcement Rules

## Purpose
Prevent invalid data from silently propagating through shared platform paths and becoming trusted downstream state.

## Scope
Applies to ingestion, transformation, publication, reconciliation, and platform-level quality controls.

## MUST
- Critical datasets MUST define machine-checkable quality expectations for required fields, keys, ranges, referential relationships, freshness, and volume where relevant.
- Quality failures MUST have an explicit disposition: fail, quarantine, degrade with warning, or accept under documented policy.
- Quality checks MUST distinguish source defects from platform processing defects when evidence permits.
- Threshold changes that reduce protection for production-critical data MUST be reviewed and auditable.
- Data correction or replay MUST preserve traceability to the affected inputs and validation evidence.

## MUST NOT
- MUST NOT silently convert failed quality checks into success to keep a pipeline green.
- MUST NOT infer correctness solely from row counts when semantic checks are required.
- MUST NOT overwrite suspect data without preserving enough evidence to investigate the failure.

## SHOULD
- Prefer checks close to the boundary where defects are introduced.
- SHOULD track quality trends and recurring failure classes rather than only individual failures.

## Exceptions
Exceptions require reason, impacted data, risk, temporary duration when applicable, compensating validation, and owner approval.

## Verification
Inspect quality definitions, CI and runtime checks, quarantine behavior, alert history, reconciliation reports, and evidence from corrected or replayed data.