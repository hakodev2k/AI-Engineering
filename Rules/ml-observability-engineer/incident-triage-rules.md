# Incident Triage

## Purpose
Provide disciplined first-response rules for production ML incidents so impact is bounded before speculative changes are made.

## Scope
Applies to alerts and reports involving model quality, data, serving, feature, telemetry, or evaluation failures.

## MUST
- Triage MUST establish affected model versions, cohorts, time window, severity, user impact, and whether the condition is ongoing.
- Responders MUST preserve relevant telemetry and change history before destructive remediation when feasible.
- Triage MUST distinguish symptoms from confirmed causes and label uncertain hypotheses as such.
- High-impact incidents MUST identify a responsible incident lead and explicit escalation path.

## MUST NOT
- MUST NOT retrain, redeploy, reset baselines, or disable controls solely because an alert fired.
- MUST NOT infer root cause from temporal correlation alone.
- MUST NOT close an incident while critical monitoring remains blind unless the residual risk is explicitly accepted.

## SHOULD
- Prefer reversible containment such as traffic reduction, rollback, or fallback when supported by evidence.
- Record key timestamps and evidence sources as investigation proceeds.

## Exceptions
Emergency containment may precede full diagnosis when necessary to protect users, but actions, authority, risk, and follow-up verification MUST be recorded.

## Verification
Review incident timelines, evidence links, containment decisions, ownership, and post-incident findings for adherence to the triage sequence.