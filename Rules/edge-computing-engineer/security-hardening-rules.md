# Security Hardening
## Purpose
Reduce attack surface on physically distributed and potentially exposed nodes.
## Scope
Operating systems, runtimes, services, ports, packages, and local interfaces.
## MUST
- Services and privileges MUST be minimized to operational need.
- Security-relevant configuration MUST use secure defaults and be centrally auditable where feasible.
- Vulnerability remediation decisions MUST consider exploitability, exposure, and fleet rollout risk.
## MUST NOT
- MUST NOT disable authentication, encryption, secure boot, or other material controls merely to unblock deployment.
- MUST NOT expose unnecessary management interfaces.
## SHOULD
- Immutable or read-only system partitions SHOULD be used where operationally practical.
## Exceptions
Control weakening requires documented threat impact, compensating controls, expiry, and security approval.
## Verification
Use configuration audits, port scans, vulnerability scanners, privilege inspection, and baseline-compliance checks.