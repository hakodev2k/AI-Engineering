# Network Security Rules

## Purpose
Reduce network attack surface and protect control, management, and data planes.

## Scope
Network devices, services, protocols, management access, hardening, and threat controls.

## MUST
- Restrict administrative access by identity, source, protocol, and least privilege.
- Disable or isolate unnecessary insecure management services and legacy protocols.
- Apply supported security updates according to risk and tested change procedures.
- Log privileged access and material security-policy changes.

## MUST NOT
- Store credentials or private keys in source code, tickets, diagrams, or plaintext operational notes.
- Weaken a security control to restore service without explicit risk ownership when exposure is material.

## SHOULD
- Use centralized identity, MFA, secure management protocols, and configuration compliance checks.

## Exceptions
Unsupported legacy equipment requires compensating isolation, monitoring, documented risk, and replacement plan.

## Verification
Review hardening baselines, vulnerability findings, AAA policy, management ACLs, audit logs, and configuration compliance.