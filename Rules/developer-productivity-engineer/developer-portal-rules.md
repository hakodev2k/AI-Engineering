# Developer Portal Rules
## Purpose
Keep internal developer portals authoritative, safe, and useful.
## Scope
Service catalogs, templates, documentation links, actions, ownership, and self-service workflows.
## MUST
- Portal metadata MUST identify accountable ownership and source of truth for critical entities.
- Self-service actions MUST validate inputs, authorize callers, and surface execution status.
- Templates MUST encode current platform guardrails rather than obsolete examples.
- Destructive or production-impacting actions MUST require explicit approval appropriate to risk.
## MUST NOT
- MUST NOT present stale metadata as authoritative when freshness cannot be established.
- MUST NOT expose privileged actions based only on UI visibility.
## SHOULD
- Portal workflows SHOULD link users to underlying evidence and recovery paths.
## Exceptions
Manually maintained metadata requires owner and freshness review cadence.
## Verification
Audit ownership coverage, authorization enforcement, template outputs, freshness signals, and action logs.