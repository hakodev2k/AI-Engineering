# Security Hardening

## Purpose
Maintain defensible Windows configurations while preserving required functionality.

## Scope
OS baselines, local policy, attack surface reduction, services, protocols, firewall, encryption, and endpoint controls.

## MUST
- Systems MUST follow an approved hardening baseline appropriate to role and exposure.
- Deviations MUST have documented business need, risk, compensating control, owner, and review date.
- Legacy protocols, weak cryptography, unnecessary services, and default administrative exposure MUST be disabled where not required.
- Security-control weakening in production MUST require explicit human approval.
- Hardening changes MUST be compatibility-tested for critical workloads.

## MUST NOT
- MUST NOT disable endpoint protection, firewall, encryption, or auditing merely to simplify troubleshooting.
- MUST NOT expose administrative services broadly when network or identity restrictions are feasible.

## SHOULD
- Automate baseline drift detection.
- Prefer secure defaults and deny-by-default administrative access.

## Exceptions
Exceptions require evidence of incompatibility, alternatives considered, residual risk, compensating controls, expiration, and approver.

## Verification
Use baseline scanners, policy inspection, firewall rules, service inventory, vulnerability scans, effective configuration, and controlled functional tests.