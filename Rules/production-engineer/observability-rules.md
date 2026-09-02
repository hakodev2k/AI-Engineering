# Observability Rules

## Purpose
Make production behavior diagnosable from reliable telemetry rather than assumptions.

## Scope
Applies to logs, metrics, traces, events, health endpoints, and operational dashboards.

## MUST
- Critical services MUST emit telemetry sufficient to identify request outcome, latency, dependency failures, saturation, and major state transitions.
- Telemetry MUST preserve correlation across service boundaries where practical.
- Operational signals MUST distinguish expected business failures from system failures.
- Sensitive data handling rules MUST apply equally to logs, traces, events, and diagnostic payloads.

## MUST NOT
- MUST NOT log credentials, session secrets, access tokens, or unnecessary sensitive payloads.
- MUST NOT declare a production root cause solely from intuition when telemetry can validate or falsify the hypothesis.
- MUST NOT depend on a single telemetry source for critical diagnosis when independent evidence is available.

## SHOULD
- Prefer structured, queryable telemetry with stable semantic fields.
- Instrument critical dependency and queue boundaries explicitly.

## Exceptions
Reduced telemetry requires documented reason, residual diagnostic risk, compensating evidence, and approval when critical systems are affected.

## Verification
Inspect telemetry schemas, dashboards, trace samples, log redaction, correlation behavior, and incident diagnostic evidence.
