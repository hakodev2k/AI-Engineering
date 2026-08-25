# Cloud Security Architecture

## Purpose
Define secure, reviewable cloud architecture decisions.

## Scope
Cloud workloads, shared services, landing zones, and trust boundaries.

## MUST
- Architecture MUST identify trust boundaries, identities, sensitive data flows, internet exposure, and administrative paths.
- Security controls MUST be mapped to documented threats and failure modes.
- Material architecture changes MUST record constraints, alternatives, residual risk, and rollback or migration strategy.
- Shared controls MUST have explicit ownership and failure behavior.

## MUST NOT
- MUST NOT rely on network location alone as a trust decision.
- MUST NOT introduce an unreviewed cross-boundary data or control path.
- MUST NOT treat provider defaults as sufficient evidence of security.

## SHOULD
- Prefer simple, centrally observable controls with narrow blast radius.
- Prefer reversible architecture changes when risk is uncertain.

## Exceptions
Exceptions require documented context, threat impact, alternatives, compensating controls, verification, expiry when temporary, and approval from the accountable owner.

## Verification
Review architecture diagrams, threat models, policy configuration, deployment diffs, and security test evidence. Confirm implemented trust boundaries match the approved design.