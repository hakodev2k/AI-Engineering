# API Server Hardening

## Purpose
Reduce Kubernetes control-plane attack surface by hardening API-server exposure, authentication, authorization, admission, and configuration.

## When to use
Use during cluster design, upgrades, security baselines, control-plane reviews, or suspected API compromise.

## Inputs
Cluster configuration, endpoint topology, auth methods, audit settings, admission configuration, certificates, and access paths.

## Preconditions
Know whether the control plane is managed or self-managed and which settings are provider-controlled.

## Context to inspect
Inspect endpoint reachability, anonymous access, authentication methods, authorization modes, insecure/deprecated flags, TLS, admission plugins, audit logging, request limits, and admin credentials.

## Core knowledge
The API server is the cluster security authority. Hardening must preserve recoverability while reducing unauthenticated reachability, weak credentials, excessive authorization, and unsafe admission behavior.

## Procedure
1. Inventory API endpoints and allowed source networks.
2. Restrict public exposure where feasible.
3. Remove weak or legacy authentication paths.
4. Validate RBAC and privileged identities.
5. Review admission configuration.
6. Enforce current TLS and certificate practices.
7. Enable useful audit coverage.
8. Review version-specific security flags and deprecations.
9. Test admin recovery paths.

## Decision points
Prefer private endpoints for sensitive environments when operational access supports them. Retain emergency access only with strong authentication, logging, and governance.

## Common failure patterns
Public API with broad source access; static admin credentials; disabled audit; stale flags; assuming managed control plane means no customer-side hardening.

## Verification
Test unauthorized access failure, approved administrative access, audit generation, and endpoint reachability from expected networks.

## Expected output
A hardened API-server posture with documented provider boundaries and recovery access.

## Stop conditions
Escalate changes that could remove all administrative access or require provider-level controls unavailable to the operator.