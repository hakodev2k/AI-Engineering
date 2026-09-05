# Telemetry Quality Rules

## Purpose
Ensure telemetry is complete, accurate, timely, and fit for operational decisions.

## Scope
Signal completeness, field validity, duplication, ordering, timeliness, and correlation quality.

## MUST
- Critical signals MUST define measurable quality expectations such as completeness, freshness, and validity.
- Telemetry used for alerts, SLOs, billing, security, or compliance MUST have stronger validation appropriate to impact.
- Duplicate, missing, malformed, and stale data conditions MUST be measurable where they can alter conclusions.
- Quality regressions MUST be investigated with producer and pipeline evidence.

## MUST NOT
- MUST NOT treat successful ingestion as proof that telemetry is semantically correct.
- MUST NOT base high-impact conclusions on known incomplete data without disclosing limitations.

## SHOULD
- Maintain synthetic or known-answer telemetry checks for critical pipelines.

## Exceptions
Require documented limitation, affected decisions, alternative evidence, and remediation owner.

## Verification
Review data-quality metrics, known-answer tests, sample records, downstream queries, and incident evidence.