# Agent Observability Rules
## Purpose
Make agent decisions, actions, costs, and failures diagnosable.
## Scope
Logs, metrics, traces, audit events, and execution records.
## MUST
- Correlate model calls, tool calls, state transitions, approvals, and outcomes for a task.
- Record latency, errors, retries, token/cost usage, and critical action results.
- Redact secrets and sensitive content according to policy.
## MUST NOT
- Log hidden credentials or unrestricted private context.
- Claim root cause without supporting operational evidence.
## SHOULD
- Provide traces sufficient to reconstruct why a consequential action occurred without exposing protected reasoning.
## Exceptions
Reduced telemetry requires documented privacy or regulatory justification and alternative diagnostics.
## Verification
Inspect dashboards, trace samples, redaction tests, audit records, and incident reconstruction exercises.