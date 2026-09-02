# PKI Architecture

## Purpose
Define resilient, auditable public key infrastructure boundaries and trust models.

## Scope
Applies to certificate authorities, registration authorities, trust stores, issuance paths, revocation, key custody, and dependent systems.

## MUST
- PKI topology MUST document trust anchors, intermediates, issuance paths, revocation paths, ownership, and failure domains.
- Root CAs MUST be isolated from routine online operations and protected by stronger controls than subordinate CAs.
- Trust relationships MUST be explicit, minimized, and reviewed before expansion.
- Availability and recovery requirements MUST be defined for every critical PKI component.

## MUST NOT
- MUST NOT introduce hidden cross-domain trust or undocumented certificate chains.
- MUST NOT make a root CA continuously online solely for operational convenience.
- MUST NOT assume cryptographic trust implies application authorization.

## SHOULD
- Prefer short, comprehensible chains of trust.
- Prefer architectures that constrain compromise blast radius.

## Exceptions
Exceptions require documented rationale, threat analysis, compensating controls, rollback approach, and approval by accountable security owners.

## Verification
Inspect topology diagrams, CA configuration, trust stores, certificate paths, HSM policies, recovery plans, and architecture decision records.