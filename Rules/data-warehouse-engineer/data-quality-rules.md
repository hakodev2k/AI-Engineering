# Data Quality Rules

## Purpose
Make warehouse data quality measurable, owned, and actionable.

## Scope
Applies to completeness, validity, uniqueness, consistency, timeliness, and referential integrity.

## MUST
- Critical datasets MUST define measurable quality expectations with owners and severity thresholds.
- Quality failures that can affect business decisions MUST be surfaced, not silently tolerated.
- Tests MUST distinguish source defects from transformation defects where practical.
- Known exceptions MUST be traceable and time-bounded.

## MUST NOT
- MUST NOT treat row-count equality as sufficient proof of correctness.
- MUST NOT disable failing quality checks without documented disposition.

## SHOULD
- Quality checks SHOULD run as close as practical to the point where defects are introduced.
- High-impact datasets SHOULD include trend-based anomaly detection in addition to deterministic checks.

## Exceptions
Accepted defects require owner, rationale, impact assessment, and remediation or review date.

## Verification
Inspect quality dashboards, test results, incident history, exception records, and sampled reconciliations.