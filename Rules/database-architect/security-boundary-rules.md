# Security Boundaries

## Purpose
Protect database systems through explicit trust boundaries and least-privilege design.

## Scope
Authentication, authorization, network access, service identities, privileged access, secrets, and administrative paths.

## MUST
- Database access MUST use individually attributable or workload-specific identities with least privilege.
- Privileged paths MUST be separated from application paths and audited.
- Sensitive databases MUST define network and identity trust boundaries explicitly.
- High-risk access changes, privilege escalation, or security-control weakening MUST require human approval.

## MUST NOT
- MUST NOT use shared administrator credentials for routine application access.
- MUST NOT expose databases publicly unless the architecture explicitly requires it and compensating controls are approved.
- MUST NOT disable encryption, auditing, or access controls merely to unblock delivery.

## SHOULD
- Prefer short-lived credentials and centralized identity where supported.
- Privilege reviews SHOULD be periodic and evidence-based.

## Exceptions
Exceptions require documented business need, scope, duration, risk, compensating controls, and security approval.

## Verification
Inspect grants, identity mappings, network policy, audit logs, privileged-access records, and configuration scans.