# Secure Developer Self-Service

## Purpose
Build secure self-service platform workflows that let developers provision and operate resources without requiring broad infrastructure privileges or bypassing mandatory controls.

## When to use
Use when designing golden paths, service catalogs, environment provisioning, deployment portals, infrastructure templates, or developer-facing platform APIs.

## Inputs
Developer workflows, resource templates, platform APIs, IAM model, policy requirements, approval rules, tenancy model, and audit requirements.

## Context to inspect
Inspect requested operations, generated infrastructure, privilege delegation, template defaults, user-supplied parameters, backend identities, approval steps, logs, and rollback behavior.

## Core knowledge
Self-service improves security when the platform centralizes privileged operations behind constrained interfaces. The platform must validate all user-controlled inputs, apply secure defaults, preserve tenant boundaries, and avoid turning backend automation into a confused deputy.

## Procedure
1. Identify the developer outcome and minimum required operations.
2. Map which operations require privileged backend access.
3. Define a narrow platform API or workflow instead of delegating infrastructure-admin rights.
4. Validate tenant, environment, ownership, and resource constraints server-side.
5. Provide secure defaults for network, identity, encryption, logging, and backup settings.
6. Enforce policy before resource creation.
7. Prevent parameter injection into shell, templates, or provider-specific privileged fields.
8. Record requester, effective identity, generated resources, and policy decisions.
9. Add approval only for genuinely high-risk actions.
10. Implement safe retry, idempotency, and rollback behavior.
11. Test unauthorized, malformed, cross-tenant, and privilege-escalation requests.
12. Measure bypass attempts and unsupported manual workflows.

## Decision points
Automate low-risk, repeatable decisions. Require human approval for exceptional actions with material blast radius, data sensitivity, or irreversible effects.

## Common failure patterns
Self-service that proxies unrestricted cloud APIs, trusting client-supplied ownership, insecure template defaults, hidden admin credentials, missing audit linkage, and approval theater without technical enforcement.

## Verification
Verify developers can complete supported tasks without elevated direct access, denied actions remain impossible through API variations, generated resources meet policy, and audit trails reconstruct who caused each change.

## Expected output
A constrained self-service flow with secure defaults, enforceable policy, auditability, and documented exception paths.

## Stop conditions
Stop when the requested workflow fundamentally requires unrestricted privilege, tenancy cannot be proven, or platform automation would become a materially broader privilege path than existing controls.