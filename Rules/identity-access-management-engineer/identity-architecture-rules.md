# Identity Architecture Rules

## Purpose
Define secure, reviewable identity architecture across users, workloads, services, and administrative planes.

## Scope
Identity providers, directories, federation, trust boundaries, authentication flows, authorization dependencies, and lifecycle integrations.

## MUST
- Identity architecture MUST document trust boundaries, authoritative identity sources, failure modes, and recovery paths.
- Every identity flow MUST identify issuer, subject, audience, credential type, validation point, and authorization decision point.
- High-impact architecture changes MUST include threat analysis, compatibility impact, rollback strategy, and owner approval.
- Machine identities MUST be designed separately from human identities when their lifecycle or privilege model differs.

## MUST NOT
- MUST NOT create implicit transitive trust between identity domains.
- MUST NOT make availability depend on an undocumented identity component.
- MUST NOT treat network location as identity proof.

## SHOULD
- Prefer standards-based, interoperable protocols and centralized policy with distributed enforcement where appropriate.
- Design degraded-mode behavior explicitly rather than allowing accidental fail-open behavior.

## Exceptions
Exceptions require documented context, alternatives, security risk, compensating controls, expiry, verification, and accountable approval.

## Verification
Review architecture diagrams, trust matrices, protocol configuration, threat models, failure tests, and rollback evidence.