# SSRF and Outbound Request Security

## Purpose
Prevent attacker-controlled API input from causing backend services to reach internal networks, cloud metadata services, privileged hosts, or arbitrary external destinations.

## When to use
Use for URL preview, webhooks, import-by-URL, image/document fetchers, proxy endpoints, callbacks, federated integrations, and any feature that performs outbound requests from user-controlled data.

## Inputs
Outbound request code, destination rules, DNS/network architecture, proxy configuration, cloud environment, redirect policy, parser behavior.

## Preconditions
Understand whether arbitrary destinations are a product requirement or whether destinations can be constrained to trusted hosts.

## Context to inspect
URL parsing, DNS resolution, redirects, IP ranges, proxy settings, protocol handlers, metadata endpoints, egress firewalls, request headers, credentials, and response handling.

## Core knowledge
SSRF defenses require canonical parsing, destination validation, network-layer egress controls, and revalidation after redirects or DNS resolution. String-prefix checks are insufficient. Private, loopback, link-local, multicast, and metadata ranges require explicit treatment.

## Procedure
1. Identify all attacker-influenced outbound destinations.
2. Prefer explicit allowlists of schemes, hosts, ports, and paths.
3. Parse URLs with a standards-compliant parser.
4. Resolve and validate destination addresses against denied network ranges.
5. Revalidate after redirects and prevent unsafe cross-origin redirects.
6. Disable unnecessary protocols and proxy inheritance.
7. Apply egress firewall or service-mesh restrictions.
8. Strip sensitive internal headers and credentials.
9. Bound response size, redirects, timeouts, and download duration.
10. Test encoded IPs, IPv6, DNS rebinding, redirects, alternate schemes, and metadata endpoints.

## Decision points
Use allowlists when integrations are known; use strong deny rules plus isolated egress infrastructure only when arbitrary outbound access is genuinely required. Prefer dedicated fetch services for high-risk use cases.

## Common failure patterns
Hostname substring checks, validating before DNS only, following redirects blindly, trusting URL schemes, allowing environment proxy bypasses, and exposing cloud metadata services.

## Verification
Run SSRF test cases against private ranges, loopback, link-local, redirect chains, and rebinding scenarios. Confirm network controls block disallowed egress independently of application logic.

## Expected output
A layered outbound-request security design with application validation, network enforcement, adversarial tests, and safe failure behavior.

## Stop conditions
Escalate when arbitrary egress is mandatory but network isolation is unavailable, DNS behavior cannot be controlled, or cloud metadata exposure cannot be mitigated.