# Serving Security Hardening

## Purpose
Harden model-serving infrastructure against unauthorized inference, model theft, credential exposure, malicious inputs, and lateral movement.

## When to use
Use before production launch, during security reviews, or after authentication, authorization, networking, or supply-chain changes.

## Inputs
Serving architecture, identity model, network topology, artifact storage, secrets, API exposure, tenant model, and threat assessment.

## Preconditions
Security ownership and required control standards are known.

## Context to inspect
Authentication, authorization, service identities, TLS, network policy, model artifact permissions, secrets, container/runtime privileges, audit logs, dependency provenance, and rate controls.

## Core knowledge
Inference endpoints protect valuable model capability and sometimes sensitive user context. Security must be enforced outside the model; prompts are not authorization controls. Artifact access, runtime identities, and tool/network access require least privilege.

## Procedure
1. Map trust boundaries and entry points.
2. Require authenticated service/user identities where appropriate.
3. Enforce authorization and tenant scope before inference.
4. Restrict network ingress and egress.
5. Protect model artifacts and signing/provenance metadata.
6. Store credentials in approved secret systems and rotate them.
7. Minimize runtime/container privileges.
8. Apply request-size and abuse controls.
9. Audit administrative, model-loading, and access events.
10. Run vulnerability and configuration reviews before release.
11. Test credential revocation and compromised-instance isolation.

## Decision points
Use private endpoints for internal workloads where possible; expose public endpoints only with appropriate authentication, abuse controls, and isolation.

## Common failure patterns
Shared broad credentials, public model stores, trusting prompt instructions for security boundaries, unrestricted egress, and sensitive request logging.

## Verification
Security tests confirm unauthorized callers, tenants, and workloads cannot access protected models or data; audit trails capture privileged changes.

## Expected output
A hardened serving configuration, threat-boundary review, identified residual risks, and verification evidence.

## Stop conditions
Do not launch with unresolved critical vulnerabilities, unknown artifact provenance, or unenforced authorization boundaries.