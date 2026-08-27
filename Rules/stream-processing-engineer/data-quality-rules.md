# Data Quality
## Purpose
Prevent silent propagation of invalid or incomplete streaming data.
## Scope
Validation, completeness, freshness, uniqueness, and semantic integrity.
## MUST
- Critical event invariants MUST be validated at the earliest trustworthy boundary.
- Invalid-event handling MUST define quarantine, rejection, correction, or accepted degradation.
- Quality thresholds affecting business outputs MUST have owners and alerts.
## MUST NOT
- Invalid values MUST NOT be silently coerced when doing so changes business meaning.
## SHOULD
- Freshness, completeness, duplication, and invalid-rate trends SHOULD be monitored where material.
## Exceptions
Temporary quality degradation requires documented impact, duration, and recovery plan.
## Verification
Use contract tests, quality assertions, reconciliation samples, and production quality metrics.