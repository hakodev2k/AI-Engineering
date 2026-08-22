# Network Security Hardening

## Purpose
Reduce attack surface on network infrastructure through secure management, protocol controls, configuration baselines, and exposure reduction.

## When to use
Use for new devices, security reviews, baseline creation, vulnerability remediation, internet exposure, or after compromise indicators.

## Inputs
Device inventory, software versions, management topology, AAA design, enabled services, security baseline, vulnerability data, and operational requirements.

## Context to inspect
Inspect management interfaces, SSH/TLS/SNMP, AAA/RBAC, NTP, logging, unused services, control-plane protection, ACLs, firmware, backups, and physical/out-of-band access.

## Core knowledge
Hardening must preserve operability. Management planes deserve stronger isolation than data planes. Disable unnecessary services, use strong authenticated protocols, and centralize identity/logging where practical.

## Procedure
1. Inventory devices, versions, and exposed services.
2. Compare against approved security baseline/vendor guidance.
3. Isolate management access to trusted paths.
4. Enforce centralized AAA and least privilege.
5. Disable legacy/insecure protocols and unused services.
6. Protect control plane and management APIs.
7. Configure secure logging, NTP, and configuration backups.
8. Patch according to vulnerability and stability risk.
9. Validate recovery and break-glass access.
10. Automate compliance checks where feasible.

## Decision points
Prioritize exploitable exposure and privilege paths over cosmetic findings. Delay firmware upgrades when operational risk exceeds immediate vulnerability risk only with documented compensating controls.

## Common failure patterns
Internet-exposed management, shared admin accounts, Telnet/weak SNMP, unverified backups, stale firmware, permissive management ACLs, and hardening that breaks monitoring or recovery.

## Verification
Scan exposed services, test RBAC, inspect configuration compliance, validate logs/backups, and confirm management access only from authorized paths.

## Expected output
A hardened, recoverable network-management posture with documented exceptions and evidence.

## Stop conditions
Escalate critical vulnerabilities requiring disruptive upgrades, missing recovery credentials, or baseline conflicts with essential operations.