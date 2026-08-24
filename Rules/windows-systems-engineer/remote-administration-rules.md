# Remote Administration

## Purpose
Keep remote Windows administration attributable, encrypted, restricted, and auditable.

## Scope
PowerShell remoting, RDP, remote management services, jump hosts, and privileged support channels.

## MUST
- Remote administration MUST require authenticated, attributable identities and encrypted transport.
- Administrative endpoints MUST be restricted by network, identity, device, or equivalent controls proportional to risk.
- Privileged remote access MUST be logged sufficiently for investigation.
- Internet exposure of administrative protocols MUST require explicit architecture/security approval.

## MUST NOT
- MUST NOT expose RDP, WinRM, SMB administration, or equivalent management ports broadly to untrusted networks.
- MUST NOT disable NLA, certificate validation, or equivalent safeguards merely for convenience.
- MUST NOT share privileged remote sessions or credentials.

## SHOULD
- Prefer hardened management paths, just-in-time access, and constrained endpoints.
- Terminate stale sessions and review anomalous access.

## Exceptions
Require scope, duration, threat assessment, compensating controls, monitoring, and approval.

## Verification
Review endpoint configuration, firewall rules, authentication policy, session logs, access paths, certificates, and attempted unauthorized access.