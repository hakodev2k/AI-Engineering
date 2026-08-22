# Skill: Secure Architecture Review

## Purpose
Assess whether a proposed architecture provides proportionate security controls and safe failure behavior.

## Trigger
Architecture review, external exposure, identity redesign, new data store, third-party integration, cross-boundary communication.

## Inputs
Design brief, diagrams, data flows, identity model, API contracts, network boundaries, data classification, deployment model.

## Procedure
1. Establish assets and trust boundaries.
2. Review authentication and authorization decisions separately.
3. Review data protection in transit, at rest, in logs, backups, exports, and caches.
4. Review secrets and key lifecycle.
5. Review network exposure, tenant isolation, SSRF/pivot paths, administrative surfaces.
6. Review dependency and supply-chain trust.
7. Review auditability, detection, rate limiting, abuse controls, recovery, and break-glass behavior.
8. Compare at least one safer alternative for major high-risk decisions.
9. Record findings as blocking, major, minor, or informational with evidence.
10. Require independent review for critical/high-risk decisions.

## Outputs
Architecture security findings, control recommendations, residual-risk statement, approval needs.

## Failure/stop
Maximum two revision cycles; unresolved critical/high risk escalates.