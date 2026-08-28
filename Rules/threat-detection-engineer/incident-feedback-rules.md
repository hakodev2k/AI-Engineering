# Incident Feedback Rules

## Purpose
Use investigation and incident outcomes to improve detection quality and close recurring coverage gaps.

## Scope
Applies to confirmed incidents, near misses, false positives, missed detections, analyst findings, and post-incident review outputs.

## MUST
- Confirmed incidents MUST be reviewed for detection opportunities, failed assumptions, and missing telemetry when relevant.
- Missed or delayed detections MUST produce tracked corrective actions or explicit risk acceptance.
- Repeated analyst workarounds MUST be evaluated for reusable detection or enrichment improvements.
- New detections derived from incidents MUST preserve evidence linking the rule to the observed failure mode.

## MUST NOT
- MUST NOT close a detection gap solely because the original incident has ended.
- MUST NOT encode one-off incident artifacts so narrowly that the rule cannot detect equivalent behavior.
- MUST NOT treat analyst confidence as a substitute for reproducible evidence.

## SHOULD
- Post-incident reviews SHOULD distinguish prevention, detection, triage, and response control failures.
- Lessons SHOULD update test fixtures and attack-simulation plans where feasible.

## Exceptions
Exceptions require documented reason, affected risk, compensating control, accountable owner, and review date.

## Verification
Inspect post-incident actions, gap tickets, new regression tests, detection provenance, remediation closure evidence, and risk acceptances.