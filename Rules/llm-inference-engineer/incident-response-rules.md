# Incident Response Rules

## Purpose
Ensure inference incidents are handled with evidence, controlled risk, and fast restoration of safe service.

## Scope
Applies to availability, latency, correctness, memory, accelerator, routing, model, runtime, and security incidents affecting inference.

## MUST
- Incidents MUST establish current user impact, affected models or versions, traffic scope, and resource state before broad corrective changes.
- Mitigation actions MUST prioritize reversibility and blast-radius reduction.
- Production conclusions MUST use logs, metrics, traces, deployment history, and hardware or runtime evidence where available.
- Suspected regressions MUST be correlated with recent model, runtime, configuration, or infrastructure changes.
- High-risk actions such as production configuration changes, traffic shifts, secret rotation, or destructive infrastructure actions MUST require authorized human approval.
- After stabilization, root cause MUST be identified or explicitly bounded with remaining uncertainty documented.

## MUST NOT
- MUST NOT restart or replace large portions of the fleet repeatedly without collecting diagnostic evidence when doing so destroys useful state.
- MUST NOT disable authentication, authorization, safety, or isolation controls as a routine mitigation.
- MUST NOT declare recovery solely because error rate falls if latency, capacity, or correctness remains degraded.

## SHOULD
- Incident runbooks SHOULD include model rollback, runtime rollback, traffic shedding, fallback routing, and device quarantine procedures.
- Post-incident actions SHOULD prioritize systemic prevention over operator reminders.

## Exceptions
Emergency deviations require incident context, explicit risk ownership, minimal necessary scope, and retrospective review.

## Verification
Review incident timeline, telemetry, change history, mitigation approvals, recovery evidence, and follow-up actions. Confirm recovery criteria covered correctness, availability, latency, and resource health as applicable.