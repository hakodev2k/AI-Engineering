# Production Incident Rules

## Purpose
Guide safe diagnosis and mitigation of failures spanning the stack.
## Scope
Production incidents, degraded service, data issues, and emergency changes.
## MUST
- Establish impact, timeline, evidence, and current system state before broad corrective action when feasible.
- Prefer reversible containment that reduces user harm while preserving evidence.
- Record production changes and require authorization for destructive or security-sensitive actions.
## MUST NOT
- Delete evidence, rewrite history, weaken security, or perform destructive data changes without explicit approval.
- Treat correlation as root cause without supporting evidence.
## SHOULD
- Use logs, metrics, traces, deploy history, client errors, and database evidence together.
## Exceptions
Immediate safety containment may precede full diagnosis when delay increases harm; actions must remain authorized and documented.
## Verification
Incident timeline, change audit, telemetry, recovery validation, and follow-up corrective actions.