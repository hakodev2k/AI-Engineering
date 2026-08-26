# SSH and Remote Access Engineering

## Purpose
Provide secure, recoverable, auditable remote administration of Linux systems.

## When to use
Use for SSH configuration, access failures, bastion design, key rotation, or remote-access hardening.

## Inputs
Administrator identities, authentication requirements, network paths, bastion model, compliance needs, and emergency access requirements.

## Context to inspect
Inspect sshd effective configuration, includes, host keys, user keys/certificates, PAM, MFA, firewall, DNS, bastions, sudo, and configuration management.

## Core knowledge
Understand public-key authentication, host verification, SSH certificates, forwarding, ProxyJump, algorithm policy, privilege separation, and lockout risk.

## Procedure
1. Define authorized remote-access paths and identities.
2. Inspect effective server configuration rather than only source files.
3. Remove weak/unneeded authentication mechanisms.
4. Prefer managed keys/certificates and strong host verification.
5. Restrict root login and forwarding according to need.
6. Integrate MFA/bastion controls where required.
7. Validate configuration syntax before reload.
8. Keep an existing session while testing a new one.
9. Test authorized, unauthorized, and recovery paths.

## Decision points
Use SSH certificates for larger fleets and centralized trust; individual keys for smaller environments with disciplined lifecycle. Bastions add control but also critical dependency risk.

## Common failure patterns
Closing the only session before validation, disabling password auth before keys work, shared private keys, unchecked agent forwarding, permissive root access, and stale authorized_keys.

## Verification
Fresh connections succeed for authorized users, prohibited methods fail, host verification works, audit trail exists, and recovery access is tested.

## Expected output
Hardened remote-access configuration with lifecycle and recovery evidence.

## Stop conditions
Stop if all recovery paths could be removed, identity ownership is unclear, or cryptographic-policy changes require security approval.