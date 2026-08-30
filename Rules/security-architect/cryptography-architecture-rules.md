# Cryptography Architecture Rules

## Purpose
Ensure cryptography is selected and integrated as an engineered control with lifecycle and failure considerations.

## Scope
Encryption, signing, hashing, key derivation, certificates, key management, and cryptographic protocol choices.

## MUST
- Cryptographic algorithms, parameters, libraries, and protocols MUST come from approved, maintained choices appropriate to the threat model.
- Keys MUST have defined ownership, generation, storage, rotation, revocation, backup, and destruction procedures.
- Cryptographic boundaries MUST identify where plaintext exists and who can access it.
- Integrity and authenticity requirements MUST be distinguished from confidentiality requirements.
- Crypto-agility MUST be considered for long-lived systems and data.

## MUST NOT
- MUST NOT invent proprietary cryptographic algorithms or protocols.
- MUST NOT store encryption keys with the protected data when that defeats the threat model.
- MUST NOT use deprecated algorithms merely for compatibility without approved containment.

## SHOULD
- Prefer managed key services or hardware-backed protection for high-value keys where feasible.

## Exceptions
Require compatibility evidence, exposure analysis, migration plan, compensating controls, and security approval.

## Verification
Review crypto inventories, key policies, certificates, configuration scans, protocol tests, rotation evidence, and dependency versions.