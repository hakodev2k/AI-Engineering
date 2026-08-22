# Documentation and Knowledge Rules
## Purpose
Prevent critical engineering knowledge from depending on individual memory.
## Scope
Operational knowledge, architecture decisions, ownership, onboarding, and continuity.
## MUST
- Ensure critical systems have current ownership, operational guidance, and recovery information.
- Record consequential technical and process decisions where future teams need rationale.
- Address single-person knowledge dependencies for business-critical areas.
## MUST NOT
- Store secrets in general documentation.
- Treat undocumented tribal knowledge as an acceptable long-term control for critical operations.
## SHOULD
- Keep documentation close to the workflow that verifies or consumes it.
## Exceptions
Sensitive details may be stored in access-controlled systems with discoverable references.
## Verification
Inspect runbooks, ownership records, decision logs, onboarding material, access controls, and continuity tests.