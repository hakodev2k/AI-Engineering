# Data Quality Rules

## Purpose
Define and enforce measurable quality expectations for production data.

## Scope
Completeness, validity, uniqueness, consistency, timeliness, accuracy proxies, and domain invariants.

## MUST
- Define measurable quality checks for critical datasets and fields.
- Set explicit thresholds and failure behavior for each critical check.
- Route quality failures to accountable owners with enough evidence to investigate.
- Track quality trends instead of relying only on point-in-time pass/fail status.

## MUST NOT
- Treat row-count equality as sufficient evidence of correctness.
- Suppress recurring quality failures without root-cause analysis or approved risk acceptance.
- Use unverifiable claims such as 'data looks correct' as release evidence.

## SHOULD
- Prioritize checks by business impact and failure detectability.
- Use statistical drift checks where fixed assertions cannot capture degradation.

## Exceptions
Relaxed thresholds require documented reason, expected duration, risk, and compensating controls.

## Verification
Review automated quality results, trend dashboards, incident history, and sampled source-to-target validation.