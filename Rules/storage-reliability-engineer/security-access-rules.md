# Security and Access Rules

## Purpose
Protect storage data and control planes from unauthorized or excessive access.

## Scope
Applies to identities, permissions, administrative interfaces, service accounts, credentials, and storage policies.

## MUST
- Enforce least privilege and separate read, write, delete, policy, and administrative capabilities where supported.
- Require strong authentication and auditable privileged access for production storage administration.
- Review high-risk access changes and time-bound emergency elevation.

## MUST NOT
- Embed credentials in source, scripts, images, or documentation.
- Grant broad administrative rights merely to simplify automation.
- Weaken access controls to resolve an operational issue without explicit human approval.

## SHOULD
- Prefer short-lived credentials and workload identity over long-lived secrets.
- Periodically review dormant and excessive permissions.

## Exceptions
Emergency elevation requires accountable approval, minimum duration, logging, and post-event revocation review.

## Verification
Inspect IAM policy, access logs, credential configuration, privilege reviews, and automated security checks.