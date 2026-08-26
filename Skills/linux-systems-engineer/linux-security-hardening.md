# Linux Security Hardening

## Purpose
Reduce host attack surface while preserving required functionality and recoverability.

## When to use
Use for baseline builds, security reviews, exposed servers, compliance remediation, or post-incident hardening.

## Inputs
Host purpose, threat model, required services, identity model, network exposure, compliance constraints, and operational access paths.

## Context to inspect
Inspect packages, listening services, accounts, sudo, SSH, PAM, filesystem permissions, kernel controls, MAC framework, firewall, secrets, audit configuration, and patch posture.

## Core knowledge
Apply least privilege, defense in depth, secure defaults, minimal attack surface, strong authentication, privilege separation, mandatory access controls, patching, and auditable administration.

## Procedure
1. Define assets, trust boundaries, and required functionality.
2. Inventory exposed services, accounts, privileges, and packages.
3. Remove or disable unnecessary components.
4. Harden remote access and administrative privilege paths.
5. Correct ownership and permissions on sensitive resources.
6. Configure firewall and MAC controls where appropriate.
7. Apply justified kernel/security controls.
8. Establish patch, audit, and integrity monitoring.
9. Test legitimate operational workflows.
10. Re-scan and document exceptions.

## Decision points
Do not apply benchmark controls mechanically; exceptions are acceptable when risk is understood and compensated. Prefer centralized identity where operationally mature.

## Common failure patterns
Locking out recovery access, disabling required protocols without dependency analysis, world-readable secrets, blanket sudo, stale accounts, and compliance-only hardening without threat modeling.

## Verification
Validate authorized and unauthorized access paths, open ports, privilege boundaries, audit events, patch state, and recovery access.

## Expected output
Risk-ranked hardening changes, exceptions, evidence, and rollback/recovery notes.

## Stop conditions
Stop before changes that can sever all administrative access, violate application support requirements, or require security-owner approval.