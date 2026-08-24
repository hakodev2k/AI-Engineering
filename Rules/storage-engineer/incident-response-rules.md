# Storage Incident Response Rules

## Purpose
Restore service safely while preserving evidence and avoiding actions that worsen data loss.

## Scope
Capacity incidents, corruption, latency, outages, path failures, degraded redundancy, and data-loss events.

## MUST
- Incident actions MUST prioritize data safety, blast-radius control, and restoration of critical service.
- Destructive or irreversible remediation MUST require explicit authorization unless a pre-approved emergency procedure covers it.
- Hypotheses MUST be tested against logs, metrics, configuration, and observed symptoms before broad changes.
- Significant incidents MUST record timeline, decisions, evidence, and follow-up actions.

## MUST NOT
- MUST NOT initialize, format, delete, force-repair, or overwrite suspected affected storage casually during diagnosis.
- MUST NOT hide uncertainty about possible data loss or corruption.
- MUST NOT make multiple uncontrolled changes that destroy causal evidence.

## SHOULD
- Use staged mitigation and preserve forensic state when compatible with recovery urgency.

## Exceptions
Immediate life/safety or catastrophic continuity scenarios may use approved emergency authority and require retrospective review.

## Verification
Review incident records, command/change history, telemetry, recovery validation, and post-incident actions.