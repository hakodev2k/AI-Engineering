# Post-Quantum Readiness Rules

## Purpose
Manage long-lived cryptographic risk and migration to post-quantum mechanisms without premature unsafe deployment.

## Scope
Public-key encryption, key establishment, signatures, certificates, protocols, and long-retention data.

## MUST
- Inventory public-key dependencies and identify data whose confidentiality or authenticity lifetime creates quantum-transition risk.
- Base adoption on approved standards, validated implementations, interoperability evidence, and current threat requirements.
- Plan protocol and certificate agility for larger keys, signatures, and messages where applicable.

## MUST NOT
- Deploy experimental post-quantum constructions as production trust anchors solely because they are novel.
- Assume hybrid constructions are secure without reviewing composition and downgrade behavior.

## SHOULD
- Test standardized candidates in non-production environments before mandatory migration windows.

## Exceptions
Early production adoption requires explicit threat justification and specialist approval.

## Verification
Inventory review, protocol-size tests, compatibility tests, algorithm-policy checks, and migration exercises.