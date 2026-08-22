# GraphQL Security Hardening

## Purpose
Reduce GraphQL-specific attack surface through layered validation, resource controls, safe defaults, and secure operational configuration.

## When to use
Use before production exposure, during security reviews, and after meaningful schema or platform changes.

## Inputs
Endpoint configuration, schema, auth model, deployment topology, client types, and threat model.

## Context to inspect
Inspect TLS, CORS, CSRF protections, GET/POST behavior, introspection, IDE exposure, query limits, uploads, batching, error details, and dependency versions.

## Core knowledge
GraphQL inherits web/API risks and adds client-controlled execution shape. Security depends on authorization plus resource governance; disabling introspection alone is not a meaningful primary defense.

## Procedure
1. Confirm authentication and authorization boundaries.
2. Enforce HTTPS and secure transport configuration.
3. Review browser CSRF/CORS behavior for the chosen transport.
4. Set depth, complexity, page-size, timeout, and body limits.
5. Restrict or configure batching to prevent amplification.
6. Sanitize errors and disable development tooling in production when appropriate.
7. Review introspection policy based on threat model, not obscurity.
8. Validate scalar/input sizes and file-upload architecture.
9. Patch GraphQL runtime and parser dependencies.
10. Test abuse cases and monitor rejected requests.

## Decision points
Allow introspection when developer usability and ecosystem needs outweigh marginal exposure, provided authorization is sound. Use allowlisted persisted operations for tightly controlled clients needing stronger execution governance.

## Common failure patterns
Schema hiding instead of authorization, unlimited aliases/batches, huge string inputs, verbose exceptions, unsafe browser cookie authentication, and missing dependency patching.

## Verification
Run security tests for privilege escalation, complexity abuse, malformed inputs, CSRF scenarios, error leakage, and resource exhaustion.

## Expected output
A hardened GraphQL endpoint with documented controls and residual risks.

## Stop conditions
Stop and escalate on unresolved critical authorization, data-exposure, or denial-of-service risk.