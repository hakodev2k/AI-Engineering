# Platform Security Hardening

## Purpose
Reduce infrastructure attack surface using repeatable secure defaults and evidence-based controls.

## When to use
Use for cloud/platform reviews, new environments, audit findings, or hardening initiatives.

## Inputs
Architecture, asset inventory, identity model, exposed services, compliance requirements, vulnerability data.

## Context to inspect
Public endpoints, IAM, firewall rules, OS/container posture, encryption, keys, patch status, logging, policy configuration.

## Core knowledge
Prioritize identity, exposure, secrets, patching, encryption, and logging. Secure defaults and automated policy are more reliable than manual review.

## Procedure
1. Inventory externally reachable assets.
2. Remove unnecessary public access.
3. Review privileged identities and federation.
4. Enforce encryption and key lifecycle.
5. Patch supported OS/images/runtimes.
6. Scan images and dependencies.
7. Apply baseline policies as code.
8. Enable security/audit logging.
9. Validate backup and recovery against destructive attack.
10. Track exceptions with expiry and owner.

## Decision points
Prioritize exploitable exposed risk over theoretical low-impact findings; use managed security controls when they reduce operational burden.

## Common failure patterns
Shared admin credentials, unrestricted ingress, stale images, disabled logs, permanent exceptions, secrets in CI.

## Verification
Policy scans pass, external exposure matches inventory, privileged access is controlled, exceptions are documented.

## Expected output
Hardened platform baseline and prioritized remediation evidence.

## Stop conditions
Escalate critical exposure or compromise indicators immediately.