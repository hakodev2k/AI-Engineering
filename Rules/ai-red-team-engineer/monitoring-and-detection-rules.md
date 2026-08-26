# Monitoring and Detection

## Purpose
Verify that material AI abuse and control failures produce useful operational signals.

## Scope
Application logs, model telemetry, policy decisions, tool calls, identity events, alerts, and incident workflows.

## MUST
- Define observable signals for high-risk attack classes and test whether representative attacks generate them.
- Verify alerts contain enough context for triage without leaking protected prompt or user data.
- Test detection across model, application, identity, and tool layers where attacks span boundaries.

## MUST NOT
- Claim an attack is detectable without exercising or validating the detection path.
- Log secrets, authentication tokens, or unnecessary sensitive content for observability.

## SHOULD
Measure alert precision, latency, coverage, and escalation behavior using safe simulations.

## Exceptions
Where raw content cannot be logged, use privacy-preserving metadata and document detection limitations.

## Verification
Replay authorized attacks and inspect telemetry, alert generation, routing, triage context, and retention controls.