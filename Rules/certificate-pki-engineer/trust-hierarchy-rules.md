# Trust Hierarchy Rules

## Purpose
Protect PKI trust boundaries and limit blast radius.

## Scope
Root, intermediate, issuing, and delegated certificate authorities.

## MUST
- Trust hierarchies MUST have documented purpose, ownership, path-length constraints, and approved relying-party scope.
- Root CA private keys MUST remain offline except for approved ceremonies.
- Issuing tiers MUST be separated by assurance level or materially different trust purpose.
- Changes to trust anchors MUST require human approval and a rollback plan.

## MUST NOT
- MUST NOT use a root CA for routine issuance.
- MUST NOT create unconstrained subordinate CAs without explicit security approval.
- MUST NOT broaden trust scope merely to resolve compatibility failures.

## SHOULD
- Hierarchies SHOULD minimize depth and cross-certification complexity.

## Exceptions
Exceptions require documented need, threat analysis, compensating controls, expiry, and security-owner approval.

## Verification
Review CA certificates, constraints, trust stores, ceremony records, architecture diagrams, and issuance configuration.