# Security Hardening

## Purpose
Reduce the gateway attack surface and enforce defensive edge controls without relying on obscurity.

## When to use
Use for gateway security reviews, internet exposure, new plugins, or post-incident hardening.

## Inputs
Threat model, route inventory, plugin/config list, network controls, security requirements.

## Context to inspect
Admin plane exposure, default routes, headers, methods, payload limits, secrets, dependency versions, WAF rules, and logging.

## Core knowledge
Understand least privilege, secure defaults, request smuggling, SSRF, header spoofing, deserialization risk, admin-plane isolation, dependency risk, and denial-of-service controls.

## Procedure
1. Map data-plane and control-plane attack surfaces.
2. Deny unused methods, routes, and protocols.
3. Strip spoofable forwarding/identity headers before adding trusted values.
4. Enforce request size and parsing limits.
5. Restrict gateway egress to approved upstreams.
6. Isolate and strongly authenticate the admin interface.
7. Minimize plugins and patch dependencies.
8. Protect secrets and redact sensitive logs.
9. Validate WAF/signature controls against false positives.
10. Run adversarial tests and review findings by severity.

## Decision points
Use WAF rules as defense in depth, not a substitute for application security. Prefer allowlists for control-plane access and upstream destinations where feasible.

## Common failure patterns
Public admin ports, trusting X-Forwarded-* from clients, permissive catch-all routes, excessive plugins, secrets in config repos, unbounded request bodies.

## Verification
Security scans, negative request tests, admin access checks, egress tests, and dependency review pass.

## Expected output
A hardened gateway configuration with documented residual risks.

## Stop conditions
Escalate critical exposures or changes requiring security-owner approval.