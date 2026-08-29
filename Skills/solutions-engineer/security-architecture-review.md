# Security Architecture Review

## Purpose
Assess whether a proposed solution preserves required trust boundaries, identity controls, data protections, and operational security.

## When to use
Use before technical approval, POC expansion, production deployment, or handling sensitive data.

## Inputs
Architecture, data flows, identities, permissions, threat model, compliance constraints, deployment configuration.

## Context to inspect
Trust boundaries, authentication, authorization, secrets, encryption, network exposure, logging, tenant isolation, data retention, and administrative access.

## Core knowledge
Security is a system property. Product features do not compensate for weak identity design, excessive privilege, exposed management planes, or unsafe data flows.

## Procedure
1. Classify data and assets.
2. Map actors, identities, and trust boundaries.
3. Review authentication and least privilege.
4. Trace sensitive data at rest and in transit.
5. Inspect secret and key lifecycle.
6. Evaluate network and administrative exposure.
7. Review auditability and incident evidence.
8. Record risks, mitigations, and approval dependencies.

## Decision points
Prefer preventive controls for high-impact threats; use detective controls where prevention is impractical and response is credible.

## Common failure patterns
Shared accounts, wildcard permissions, secrets in configuration, implicit trust, missing audit logs, and compliance treated as equivalent to security.

## Verification
Security boundaries and permissions are tested where possible and residual risks have explicit owners.

## Expected output
A security review with prioritized findings and mitigations.

## Stop conditions
Stop and escalate on unresolved high-impact exposure, missing security authority, or prohibited data handling.