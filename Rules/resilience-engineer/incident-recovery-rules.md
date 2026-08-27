# Incident Recovery Rules

## Purpose
Restore safe service quickly while preserving evidence and avoiding recovery actions that deepen impact.

## Scope
Applies to operational incidents involving availability, degradation, data risk, dependency failure, and capacity exhaustion.

## MUST
- Incident recovery MUST prioritize containment and restoration of critical outcomes before nonessential optimization.
- Recovery actions MUST have an identified operator, expected effect, validation signal, and abort condition when time permits.
- Destructive actions, data deletion, infrastructure destruction, secret rotation, or irreversible state changes MUST require authorized human approval unless an established emergency procedure explicitly grants authority.
- Responders MUST preserve relevant logs, metrics, traces, timelines, and state evidence when doing so does not impede urgent safety.
- Service restoration MUST be validated through user-relevant signals.

## MUST NOT
- MUST NOT execute multiple speculative high-impact changes simultaneously when their effects cannot be distinguished.
- MUST NOT declare recovery solely because alerts stopped.
- MUST NOT conceal unresolved integrity or durability uncertainty behind an availability status.

## SHOULD
- Responders SHOULD prefer reversible containment actions first.
- Known-good runbooks SHOULD be used over improvised commands when applicable.

## Exceptions
Immediate action may precede full evidence collection when delay increases harm; rationale and observed effects MUST be documented afterward.

## Verification
Review incident timelines, approvals, commands or changes, telemetry, customer-impact signals, and post-incident findings. Confirm restoration and residual risks were explicitly validated.