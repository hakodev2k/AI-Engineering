# API Gateway Security

## Purpose
Configure API gateways as a consistent security control plane for ingress policy while preserving application-level authorization and business safeguards.

## When to use
Use when introducing or reviewing gateways, reverse proxies, WAFs, ingress controllers, API management platforms, or shared edge policy.

## Inputs
Gateway routes, authentication configuration, TLS settings, rate limits, header policies, backend mappings, logging, network topology, application security requirements.

## Preconditions
Know which controls belong at the edge and which require application context.

## Context to inspect
Route matching, host validation, TLS termination, forwarded headers, auth plugins, CORS, request/response transforms, size limits, rate limits, backend trust, admin interfaces, and bypass paths.

## Core knowledge
Gateways are effective for uniform protocol and perimeter controls but cannot safely replace object-level or business-state authorization. The application must only trust gateway-added identity headers when direct backend access is prevented and inbound spoofed copies are removed.

## Procedure
1. Inventory public and internal routes.
2. Verify TLS policy and certificate handling.
3. Enforce trusted host and route matching.
4. Strip spoofable identity and forwarding headers before adding trusted values.
5. Apply authentication where appropriate.
6. Configure payload, timeout, rate, and concurrency limits.
7. Restrict methods and content types by route.
8. Protect gateway administration separately from data-plane traffic.
9. Ensure backends cannot be reached through an unprotected alternate path.
10. Test route confusion, header spoofing, path normalization, and policy bypass.
11. Monitor denied requests and configuration drift.

## Decision points
Centralize generic controls such as TLS, coarse authentication, quotas, and header normalization. Keep resource authorization, workflow rules, and tenant-aware decisions in the application when edge context is insufficient.

## Common failure patterns
Direct backend bypass, trusting client-supplied X-Forwarded headers, inconsistent route policies, wildcard CORS, exposed admin ports, oversized timeouts, and security assumptions tied to route naming.

## Verification
Compare gateway inventory with deployed services, probe alternate paths, test spoofed headers and normalization variants, and confirm edge/application policies fail closed together.

## Expected output
A hardened gateway configuration with explicit control ownership, bypass resistance, tests, and monitoring.

## Stop conditions
Escalate when network architecture permits unavoidable direct backend access, gateway policy ownership is fragmented, or a required business authorization rule cannot be enforced reliably at the chosen layer.