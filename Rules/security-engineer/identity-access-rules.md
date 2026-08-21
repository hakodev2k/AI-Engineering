# Identity and Access Rules

## Purpose
Define strong identity verification and least-privilege authorization practices.

## Scope
Applies to workforce, customer, service, machine, administrative, and emergency access.

## MUST
- Every privileged action MUST require an authenticated identity with traceable accountability.
- Authorization MUST be enforced server-side at the protected resource or action boundary.
- Least privilege MUST be applied to users, services, workloads, and automation.
- Privileged access MUST be reviewed regularly and removed when no longer required.
- High-risk role assignments and access changes MUST require explicit approval and audit evidence.

## MUST NOT
- MUST NOT rely on client-side checks as an authorization boundary.
- MUST NOT share administrative accounts between individuals.
- MUST NOT grant broad standing permissions merely for convenience.

## SHOULD
- Prefer strong multi-factor authentication for privileged access.
- Prefer centralized role- or attribute-based policies over scattered authorization logic.
- Prefer short-lived workload credentials where supported.

## Exceptions
Emergency access requires documented reason, approver, time limit, and post-use review.

## Verification
Use IAM policy review, access logs, entitlement reports, automated policy tests, penetration testing, and periodic access recertification.