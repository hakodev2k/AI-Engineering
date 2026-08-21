# Frontend Observability Rules

## Purpose
Ensure production frontend failures and performance issues can be investigated with trustworthy telemetry.

## Scope
Applies to client errors, performance telemetry, user-flow events, correlation identifiers, and diagnostic logging.

## MUST
- Production-critical failures MUST emit diagnostic evidence sufficient to identify the affected feature and operation.
- Telemetry MUST avoid secrets, authentication tokens, and unnecessary personal or sensitive data.
- Client and server traces SHOULD share correlation context when the platform supports it.
- Error and performance events MUST distinguish release/version information when deployments can change behavior.
- Observability added for an incident MUST define whether it is permanent, temporary, or subject to sampling.

## MUST NOT
- MUST NOT log full sensitive payloads merely for debugging convenience.
- MUST NOT treat analytics events as a substitute for diagnostic telemetry when investigating failures.
- MUST NOT conclude that an issue is fixed solely because telemetry volume decreases without validating user behavior.

## SHOULD
- Prefer structured events with stable names and dimensions.
- Prefer actionable metrics tied to critical journeys over large volumes of low-value events.

## Exceptions
Any temporary increase in sensitive diagnostic detail requires explicit approval, minimized scope, retention controls, and removal criteria.

## Verification
Inspect emitted telemetry, validate redaction, reproduce known failures, verify release/correlation fields, and confirm dashboards or queries can answer expected diagnostic questions.