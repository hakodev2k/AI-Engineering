# Cryptographic Incident Response

## Purpose
Contain and recover from suspected key compromise, certificate misuse, nonce failure, weak algorithm exposure, or cryptographic implementation defects.

## When to use
Use when secret material may be exposed, signatures/certificates are abused, randomness fails, crypto validation is bypassed, or a critical crypto vulnerability affects production.

## Inputs
Incident evidence, key inventory, affected systems/data, logs, certificate/key metadata, dependencies, and recovery capabilities.

## Context to inspect
Key versions and consumers, audit logs, issuance/signing records, ciphertext scope, backups, caches, replicas, deployment history, and external relying parties.

## Core knowledge
Crypto incidents often require both technical containment and trust re-establishment. Rotating a key is insufficient if compromised credentials can create another key or old signatures/certificates remain trusted.

## Procedure
1. Preserve evidence and classify suspected failure.
2. Identify affected key/material, scope, and security properties.
3. Contain attacker access to key-management and issuance paths.
4. Determine whether revocation, rotation, re-encryption, or trust-root changes are required.
5. Deploy readers/verifiers for replacement material before switching where possible.
6. Revoke or disable compromised material with relying-party impact analysis.
7. Reissue certificates/tokens/artifacts as needed.
8. Search logs and data for misuse during exposure window.
9. Validate restored trust and remove temporary controls.
10. Add regression tests, lifecycle changes, and post-incident evidence.

## Decision points
Immediate revocation is appropriate when ongoing misuse risk outweighs outage impact; staged replacement may be necessary when availability and dependency constraints dominate. Assume data confidentiality loss may be irreversible after key exposure.

## Common failure patterns
Blind key rotation; destroying forensic evidence; leaving compromised issuer access; incomplete consumer inventory; reusing old trust; no external notification path.

## Verification
Prove compromised material can no longer perform accepted operations, replacement trust works, stale consumers are identified, and regression tests reproduce the original defect.

## Expected output
A scoped incident record, containment/recovery actions, trust-restoration evidence, and preventive changes.

## Stop conditions
Escalate immediately for root/CA/signing-key compromise, uncertain blast radius, legal notification triggers, or irreversible destructive actions.