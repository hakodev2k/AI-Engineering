# Proxy Protocol and Client IP Preservation

## Purpose
Preserve trustworthy client identity across proxy layers without creating spoofing or protocol compatibility failures.

## When to use
Use when applications need client IP for security, logging, rate limiting, geolocation, or audit.

## Inputs
Proxy chain, trusted hops, protocol, source NAT behavior, header conventions, and application parsing rules.

## Context to inspect
Inspect X-Forwarded-For/Forwarded handling, PROXY protocol support, network ACLs, ingress chain, application trust configuration, and logs.

## Core knowledge
Forwarded headers are trustworthy only when inserted or sanitized by known proxies. PROXY protocol carries connection metadata below HTTP but both endpoints must agree on its use. Direct client access can enable spoofing if trust boundaries are wrong.

## Procedure
1. Draw every proxy and NAT hop.
2. Define the authoritative client-address source.
3. Restrict backend access to trusted proxy paths.
4. Configure header overwrite/append semantics or PROXY protocol.
5. Configure application trusted-proxy ranges.
6. Test IPv4, IPv6, multiple proxies, and direct-access attempts.
7. Validate logs and rate-limit identity.
8. Monitor malformed metadata and parsing errors.
9. Document trust boundaries.

## Decision points
Use standardized forwarded headers for HTTP-aware chains; use PROXY protocol when transport-level metadata is needed. Never trust arbitrary inbound forwarding headers from the public edge.

## Common failure patterns
Header spoofing; double-appending addresses; enabling PROXY protocol on only one side; losing IPv6; trusting broad private ranges.

## Verification
Send controlled requests through each supported path and confirm the application records the correct client while spoof attempts fail.

## Expected output
A secure client-identity propagation design and tested configuration.

## Stop conditions
Escalate when direct backend access cannot be restricted or identity is used for high-risk authorization decisions without stronger authentication.