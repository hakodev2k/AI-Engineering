# Identity and Access Architecture Rules

## Purpose
Provide consistent enterprise identity boundaries and access governance.

## Scope
Workforce identity, customer identity, service identities, privileged access, federation, and machine-to-machine access.

## MUST
- Identity sources, authentication authorities, authorization ownership, and lifecycle responsibilities MUST be explicit.
- Privileged and machine identities MUST be governed with least privilege, rotation or lifecycle controls, and auditability.
- Federation and trust relationships MUST define issuer, audience, claims, revocation, and failure expectations.

## MUST NOT
- MUST NOT create shared privileged identities without approved exceptional controls.
- MUST NOT rely on network location alone as proof of identity or authorization.

## SHOULD
- Prefer centralized identity capabilities with decentralized authorization ownership where domain context is required.

## Exceptions
Legacy constraints require documented compensating controls and retirement milestones.

## Verification
Inspect identity architecture, access policies, privileged-access reviews, federation configuration, and audit evidence.