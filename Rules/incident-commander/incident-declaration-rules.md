# Incident Declaration Rules

## Purpose
Ensure incidents are declared promptly, consistently, and with enough structure to mobilize the right response.

## Scope
Applies to operational events that may materially affect customers, data, security, availability, revenue, compliance, or critical internal services.

## MUST
- Declare an incident when impact, uncertainty, or escalation risk crosses the project-defined threshold.
- Assign an initial severity using observable impact and scope, not intuition alone.
- Record declaration time, known impact, affected systems, and the current incident owner.
- Reassess severity when new evidence changes customer, data, or operational impact.
- Treat suspected security or data-loss events as incidents until ruled out by evidence.

## MUST NOT
- Delay declaration merely to collect perfect information.
- Suppress an incident to protect metrics, reputation, or release timelines.
- Use severity labels inconsistently across responders during the same event.

## SHOULD
- Prefer early declaration with later downgrade over late declaration after impact expands.
- Use standard declaration criteria and examples to reduce responder ambiguity.

## Exceptions
Any departure from standard declaration thresholds requires documented rationale and retrospective review if customer or production impact occurred.

## Verification
Review incident records for timestamps, severity rationale, scope, impact description, and evidence supporting any later reclassification.