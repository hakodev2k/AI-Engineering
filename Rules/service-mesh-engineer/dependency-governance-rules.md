# Dependency Governance
## Purpose
Make service communication dependencies explicit and governable.
## Scope
Service graphs, ownership, criticality, contracts, cross-team dependencies, and deprecation.
## MUST
- Critical service dependencies MUST have identifiable owners and expected failure behavior.
- Policy changes MUST assess downstream and upstream consumers before enforcement.
- Deprecated routes or identities MUST be proven unused before removal.
## MUST NOT
- MUST NOT infer safe removal solely from configuration absence when runtime traffic evidence exists.
- MUST NOT create hidden dependencies through broad wildcard routing.
- MUST NOT make ownership assumptions without evidence.
## SHOULD
- Runtime topology SHOULD be reconciled with declared architecture to detect drift.
## Exceptions
Undocumented emergency dependencies require follow-up ownership and lifecycle documentation.
## Verification
Compare traffic graphs, service catalogs, route configuration, ownership metadata, and deprecation telemetry.