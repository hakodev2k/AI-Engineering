# Incident Response Rules

## Purpose
Restore API service safely while preserving evidence and controlling blast radius.

## Scope
Applies to reliability incidents, severe degradations, dependency failures, and emergency mitigations.

## MUST
- Incident response MUST prioritize user-impact containment and service restoration before nonessential root-cause work.
- Severity, incident ownership, communication cadence, and decision authority MUST be explicit for material incidents.
- Mitigations MUST record expected effect, risk, owner, and verification signal.
- Production conclusions MUST use available logs, metrics, traces, changes, and direct tests rather than confidence alone.
- Emergency changes with destructive, security, or irreversible impact MUST require human approval.

## MUST NOT
- MUST NOT destroy diagnostic evidence unnecessarily during mitigation.
- MUST NOT make multiple unrelated high-risk changes simultaneously unless containment urgency justifies it.
- MUST NOT declare recovery solely because an alert stopped firing.

## SHOULD
- The incident timeline SHOULD capture major observations, hypotheses, actions, and outcomes.
- Recovery SHOULD be verified from client-visible signals and critical workflows.

## Exceptions
Urgent deviations require contemporaneous rationale when feasible and mandatory retrospective documentation afterward.

## Verification
Review incident records, telemetry, change history, recovery checks, approvals, and post-incident action tracking.