# Security Engineering Leadership

## Purpose
Integrate security risk management into normal engineering decisions and delivery.

## When to use
Use for sensitive features, architecture changes, integrations, access changes, and release reviews.

## Inputs
Data classification, threat model, identities, architecture, dependencies, security requirements, findings.

## Context to inspect
Inspect trust boundaries, authorization, secrets, inputs, data flows, external exposure, supply chain, and logging.

## Core knowledge
Security is risk reduction across prevention, detection, and recovery. Controls should match threat likelihood and impact while preserving usable systems.

## Procedure
1. Identify assets and sensitive operations.
2. Map trust boundaries and attacker-reachable surfaces.
3. Confirm authentication and authorization at enforcement points.
4. Review input handling and output encoding.
5. Inspect secret and key lifecycle.
6. Review dependency and deployment risks.
7. Define abuse cases and required controls.
8. Add security-focused tests and monitoring.
9. Track findings by severity and owner.
10. Require explicit acceptance for residual high risk.

## Decision points
Prefer least privilege and deny-by-default for sensitive operations. Use compensating controls only when primary controls are impractical and residual risk is understood.

## Common failure patterns
Security only at release time, client-side authorization, broad permissions, secrets in configuration, and unowned findings.

## Verification
Security boundaries are tested, high-risk findings are resolved or accepted by authorized owners, and detection exists for critical abuse.

## Expected output
A prioritized security assessment with controls, evidence, residual risks, and owners.

## Stop conditions
Stop release or escalate for unresolved critical exposure, suspected compromise, or risk acceptance beyond team authority.