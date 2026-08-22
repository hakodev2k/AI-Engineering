# Security Architecture Rules

## Purpose
Integrate security into architecture decisions rather than treating it as a post-implementation activity.

## Scope
Applies to trust boundaries, data flows, identities, APIs, infrastructure, integrations, and production operations.

## MUST
- High-impact designs MUST identify assets, trust boundaries, attack surfaces, threat actors, and abuse cases.
- Security controls MUST follow least privilege, defense in depth, and secure-by-default principles.
- Sensitive data MUST be protected in transit and at rest according to classification and threat model.
- Internet-exposed components MUST explicitly address authentication, authorization, input validation, rate abuse, and observability.
- High-risk security exceptions MUST require explicit approval and expiry/review criteria.

## MUST NOT
- MUST NOT weaken authentication, authorization, encryption, or audit controls solely to simplify delivery.
- MUST NOT store secrets in source code or architecture artifacts.
- MUST NOT assume internal networks are trusted by default.

## SHOULD
- Use threat modeling early for critical systems.
- Prefer managed security controls when they reduce operational error without reducing required visibility.

## Exceptions
Temporary controls require documented risk, compensating controls, owner, and deadline.

## Verification
Review threat models, access matrices, data-flow diagrams, security tests, scanner results, configuration, penetration findings, and exception records.