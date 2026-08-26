# Incident Response

## Purpose
Restore ML platform service safely while preserving evidence and controlling secondary damage.

## Scope
Platform outages, degraded training/serving, data incidents, artifact failures, and security-impacting operational events.

## MUST
- Incidents MUST establish severity, commander/owner, affected capabilities, and current evidence.
- Mitigations MUST prioritize reversible actions and explicit blast-radius control.
- Material actions and observations MUST be timestamped for reconstruction.
- Root-cause claims MUST be supported by evidence; uncertainty MUST be stated.

## MUST NOT
- Destructive remediation MUST NOT be executed without appropriate approval unless governed emergency authority explicitly permits it.
- Evidence MUST NOT be altered to make a hypothesis fit.

## SHOULD
- Incidents SHOULD result in durable corrective actions addressing systemic contributors, not only the trigger.

## Exceptions
Emergency authority must be predefined, bounded, auditable, and reviewed afterward.

## Verification
Review incident timeline, telemetry, approvals, mitigation evidence, postmortem, action ownership, and recurrence tests.