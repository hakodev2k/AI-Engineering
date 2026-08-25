# SSRF and URL Fetching Security

## Purpose
Prevent server-side URL features from becoming network pivots into internal services, metadata endpoints, or unintended protocols.

## When to use
Use for webhooks, URL previews, import-by-URL, callbacks, image fetchers, crawlers, and proxy features.

## Inputs
URL handling code, DNS/network architecture, egress policy, redirect behavior, supported schemes, and cloud metadata controls.

## Context to inspect
Inspect parsing, DNS resolution, redirects, proxy settings, IP families, alternate numeric forms, credentials in URLs, and destination response handling.

## Core knowledge
SSRF defenses require canonical URL parsing plus network-level destination control. DNS rebinding, redirects, IPv6, and parser discrepancies can bypass naive string filters.

## Procedure
1. Define the legitimate destination set and protocols.
2. Use a single standards-compliant URL parser.
3. Allowlist schemes and ports.
4. Resolve destinations and block loopback, link-local, private, metadata, and other prohibited ranges according to policy.
5. Revalidate redirect destinations and bound redirect count.
6. Apply egress firewall/proxy restrictions as defense-in-depth.
7. Bound response size, timeouts, and decompression.
8. Avoid forwarding ambient credentials or sensitive headers.
9. Test encoded hosts, IPv6, DNS changes, redirects, and parser edge cases.

## Decision points
Prefer explicit destination allowlists for narrow integrations. For arbitrary public URLs, combine robust destination classification with controlled egress.

## Common failure patterns
Substring host checks, validating before redirects only, blocking IPv4 but not IPv6, and assuming DNS names remain bound to one address.

## Verification
Demonstrate blocked access to prohibited network classes through direct, redirected, and alternative representations while valid destinations still work.

## Expected output
A constrained URL-fetching design with layered controls and tests.

## Stop conditions
Escalate when required functionality intentionally accesses sensitive internal networks or egress controls cannot enforce the threat model.