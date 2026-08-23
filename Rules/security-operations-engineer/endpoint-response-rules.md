# Endpoint Response Rules

## Purpose
Standardize investigation and response on potentially compromised endpoints.

## Scope
Servers, workstations, virtual machines, and managed endpoint workloads.

## MUST
- Endpoint investigations MUST capture process, persistence, network, user, and relevant file-system evidence before destructive remediation when practical.
- Isolation decisions MUST consider business criticality, attacker activity, and lateral-movement risk.
- Reimaging MUST be accompanied by root-cause remediation and credential review where identity exposure is plausible.
- Endpoint response actions MUST be auditable and tied to an incident record.

## MUST NOT
- MUST NOT delete suspicious artifacts before required evidence is preserved.
- MUST NOT return a host to service solely because malware scans are clean.

## SHOULD
- Endpoint response SHOULD validate EDR health and increased monitoring after recovery.

## Exceptions
Immediate isolation may precede evidence collection when active compromise creates material risk.

## Verification
Review EDR telemetry, evidence records, isolation actions, rebuild records, credential actions, and return-to-service checks.