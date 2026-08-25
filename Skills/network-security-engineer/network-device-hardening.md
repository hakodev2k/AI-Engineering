# Network Device Hardening

## Purpose
Reduce attack surface and administrative risk on routers, switches, firewalls, controllers, and network appliances.

## When to use
Use for device onboarding, baseline reviews, upgrades, audit findings, or compromise recovery.

## Inputs
Device role, OS/version, vendor guidance, management requirements, authentication sources, logging targets.

## Context to inspect
Management interfaces, AAA, services, SNMP, NTP, SSH/TLS, configuration backups, control-plane protections, firmware status.

## Core knowledge
Management-plane isolation, least privilege, secure protocols, AAA, control-plane policing, configuration integrity, lifecycle risk.

## Procedure
1. Inventory enabled services and interfaces.
2. Disable unnecessary services and insecure protocols.
3. Restrict management-plane reachability.
4. Integrate centralized AAA with break-glass access.
5. Harden SSH/TLS/SNMP settings.
6. Configure time, logging, and configuration backups.
7. Apply control-plane protections.
8. Patch within validated lifecycle constraints.
9. Compare against approved baseline.

## Decision points
Use local accounts only for controlled emergency access. Prioritize compensating controls when immediate patching threatens network stability.

## Common failure patterns
Internet-exposed management, Telnet/HTTP, shared admin accounts, SNMPv2 community reuse, stale firmware, untested backups.

## Verification
Run configuration compliance checks, test AAA and break-glass, validate logging, confirm disabled services are unreachable, restore a backup in a safe environment.

## Expected output
Hardened configuration, deviations with rationale, verification evidence, lifecycle actions.

## Stop conditions
Escalate unsupported devices, changes that risk lockout without console recovery, or security requirements incompatible with platform capability.