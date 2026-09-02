# Code Signing

## Purpose
Protect software provenance and prevent unauthorized signing of executable artifacts.

## Scope
Applies to code-signing certificates, signing keys, CI/CD integration, approvals, timestamps, and verification.

## MUST
- Production code-signing keys MUST be protected by approved hardware-backed or equivalently strong controls appropriate to release impact.
- Signing workflows MUST authenticate the build or release identity and record what artifact was signed, by which key, and under which approval.
- Signed artifacts MUST be verifiable against trusted publishers and expected certificate policy.
- Key rotation and revocation plans MUST account for already distributed artifacts and timestamp validation.

## MUST NOT
- MUST NOT expose signing keys to general build agents or developer workstations without explicit design approval.
- MUST NOT sign artifacts whose provenance or integrity cannot be established.
- MUST NOT reuse code-signing keys for TLS, document signing, or unrelated purposes.

## SHOULD
- Prefer isolated signing services with policy-enforced artifact identity.
- Use trusted timestamping where long-lived signature validation is required.

## Exceptions
Require documented release risk, compensating controls, bounded scope, and security approval.

## Verification
Inspect signing logs, key custody, CI/CD permissions, artifact hashes, certificate EKUs, signature validation, and timestamp evidence.