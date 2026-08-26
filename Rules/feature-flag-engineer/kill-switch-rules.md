# Kill Switch Rules

## Purpose
Provide reliable emergency controls that reduce harm without creating new failure modes.

## Scope
Flags intended to disable risky behavior or activate degraded safe modes.

## MUST
- Kill switches MUST have documented activation effects, dependencies, operator authority, and recovery steps.
- Critical kill switches MUST be tested periodically in a safe environment or controlled production exercise.
- Activation MUST emit auditable events and operational telemetry.
- The disabled path MUST remain viable for the expected emergency duration.

## MUST NOT
- A kill switch MUST NOT depend exclusively on the component it is intended to mitigate.
- Activation MUST NOT silently corrupt data or violate required invariants.
- Operators MUST NOT improvise semantics during an incident.

## SHOULD
- Critical switches SHOULD be quickly accessible to authorized responders while retaining strong authentication.

## Exceptions
Untested emergency controls require explicit risk acceptance and remediation plan.

## Verification
Review drills, access controls, audit logs, dependency diagrams, failure tests, and runbooks.