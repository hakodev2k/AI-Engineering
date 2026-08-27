# Identity Architecture
## Purpose
Establish durable trust boundaries and identity ownership.
## Scope
Workforce, customer, service, and machine identities.
## MUST
- Identity sources, trust boundaries, authoritative attributes, and lifecycle owners MUST be documented before integration.
- Authentication, authorization, provisioning, and audit responsibilities MUST have explicit system boundaries.
- Material architecture changes MUST record constraints, alternatives, migration impact, and rollback strategy.
## MUST NOT
- Identity authority MUST NOT be duplicated without a documented reconciliation model.
- Convenience MUST NOT override a defined trust boundary.
## SHOULD
- Prefer standards-based, loosely coupled identity interfaces.
## Exceptions
Document reason, risk, compensating controls, verification, and approval.
## Verification
Review architecture diagrams, trust flows, ADRs, configuration, and integration tests.