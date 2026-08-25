# Device Key Management

## Purpose
Design the complete lifecycle of firmware and device cryptographic keys so compromise is contained and keys can be provisioned, rotated, revoked, recovered, and retired safely.

## When to use
Use for device identity, secure boot/update signing, TLS credentials, manufacturing provisioning, key rotation, or response to suspected key compromise.

## Inputs
Threat model, cryptographic uses, device capabilities, PKI/HSM services, manufacturing flow, fleet size, connectivity constraints, ownership boundaries, and retention policy.

## Preconditions
Classify each key by purpose, scope, lifetime, and compromise impact. Never expose production private keys in source, logs, tickets, or test fixtures.

## Context to inspect
Generation, entropy, derivation, storage, transport, activation, use authorization, backup, rotation, revocation, destruction, audit, and recovery for every key class.

## Core knowledge
Key separation limits blast radius. Device-unique keys outperform fleet-wide shared secrets for identity. Signing roots should normally remain offline or HSM-protected. Rotation must be designed before deployment because field devices may be intermittently connected or unable to trust a new key without a pre-established path.

## Procedure
1. Inventory all keys and cryptographic secrets.
2. Assign owner, purpose, algorithm, scope, lifetime, and trust boundary.
3. Eliminate unnecessary shared secrets and multi-purpose keys.
4. Define secure generation and entropy requirements.
5. Keep root/signing private keys outside firmware and ordinary CI workers.
6. Provision device credentials over authenticated manufacturing channels.
7. Store device secrets in hardware-backed storage when available.
8. Define key versioning and overlap windows for rotation.
9. Build revocation and emergency compromise procedures.
10. Ensure firmware can distinguish trusted current, next, and revoked keys without rollback gaps.
11. Audit key use without logging secret material.
12. Test rotation, lost connectivity, expired credentials, compromised intermediates, and decommissioning.

## Decision points
Prefer asymmetric device identity when server-side verification can support it. Use derived keys when hardware roots and context-separated KDFs reduce stored secret count. Back up only keys whose loss must be recoverable; nonrecoverable device identity may be regenerated only if the trust model permits re-enrollment.

## Common failure patterns
Fleet-wide symmetric secrets; signing keys in CI environment variables; no rotation path; reusing encryption keys for authentication; weak random generation; copying production keys into labs; revocation lists devices cannot obtain; logging private material.

## Verification
Trace each key from creation to destruction, verify least-privilege access, exercise rotation and revocation on real devices, confirm compromised old keys cannot authorize new artifacts, and review audit records for accountable signing/provisioning events.

## Expected output
Key inventory, lifecycle design, provisioning/rotation implementation, compromise runbook, access controls, and validation evidence.

## Stop conditions
Escalate if production key custody is unknown, HSM/policy access is unavailable, rotation would strand deployed devices, or a shared secret cannot be replaced without coordinated product approval.