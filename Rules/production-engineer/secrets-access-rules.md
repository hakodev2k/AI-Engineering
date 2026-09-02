# Secrets and Access Rules

## Purpose
Protect production credentials and enforce least-privilege operational access.

## Scope
Applies to human, service, automation, break-glass, and third-party access to production systems.

## MUST
- Production access MUST be least privilege, attributable to an identity, and limited to required scope and duration.
- Secrets MUST be stored and distributed through approved secret-management mechanisms.
- Privileged or break-glass access MUST be auditable and reviewed after use.
- Access changes that materially increase privilege MUST require human approval.

## MUST NOT
- MUST NOT embed credentials in source code, deployment manifests, tickets, chat logs, or ordinary configuration.
- MUST NOT share personal production credentials between operators.
- MUST NOT disable authentication, authorization, or audit controls to unblock routine operations.

## SHOULD
- Prefer short-lived credentials and workload identity over static secrets.
- Review dormant and high-privilege access regularly.

## Exceptions
Emergency access requires explicit justification, minimal duration, audit capture, and post-event review.

## Verification
Inspect IAM policy, secret stores, access logs, credential lifetime, break-glass records, and privilege reviews.
