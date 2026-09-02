# Incident Response Rules

## Purpose
Restore service safely while preserving evidence and clear operational control.

## Scope
Applies to production incidents affecting availability, correctness, security, performance, or data integrity.

## MUST
- Incidents MUST have a clearly identified incident lead when coordination is required.
- Mitigation MUST prioritize reducing user and data impact before nonessential diagnosis or cleanup.
- Material actions, observations, hypotheses, and decisions MUST be timestamped or otherwise reconstructable.
- High-risk mitigation actions MUST require explicit human authorization when they can cause destructive or irreversible effects.

## MUST NOT
- MUST NOT make simultaneous uncontrolled changes that prevent attribution of cause or effect.
- MUST NOT destroy relevant logs, state, or forensic evidence during mitigation unless required to stop greater harm.
- MUST NOT declare resolution until service health and critical user paths are verified.

## SHOULD
- Use structured incident roles and communication for complex incidents.
- Convert confirmed lessons into tracked corrective actions.

## Exceptions
Emergency deviations require recorded justification and retrospective review.

## Verification
Inspect incident timelines, action logs, telemetry, approvals, recovery evidence, and post-incident follow-up.
