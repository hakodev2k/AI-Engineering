# Cryptographic Design Rules

## Purpose
Ensure cryptographic controls solve explicit threats with reviewable assumptions.

## Scope
Protocol, application, storage, identity, and infrastructure cryptography.

## MUST
- Define assets, adversaries, trust boundaries, security properties, and failure consequences before selecting primitives.
- Use established constructions with documented security assumptions and supported parameter sizes.
- Record protocol versioning, algorithm identifiers, key lifecycle, and downgrade behavior.

## MUST NOT
- Invent cryptographic primitives or ad-hoc protocol constructions for production use.
- Treat encryption alone as proof of authenticity, integrity, freshness, or authorization.

## SHOULD
- Prefer simple, misuse-resistant constructions and independently reviewed standards.

## Exceptions
Deviations require rationale, alternatives, threat analysis, test evidence, and security-owner approval.

## Verification
Review threat models, design records, test vectors, interoperability tests, and independent security review evidence.