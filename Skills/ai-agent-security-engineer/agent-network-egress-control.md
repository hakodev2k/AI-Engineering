# Agent Network Egress Control

## Purpose
Constrain outbound network access from agent runtimes and tools to reduce exfiltration, SSRF, command-and-control, and unexpected dependency risks.

## When to use
Use for agents with generic HTTP, browser, code execution, package installation, webhook, or connector capabilities.

## Inputs
Required destinations, protocols, DNS architecture, network topology, proxy configuration, data classifications, and runtime platform.

## Preconditions
Identify legitimate external dependencies and distinguish fixed service endpoints from user-selected destinations.

## Context to inspect
VPC/VNet rules, Kubernetes network policies, proxies, DNS, NAT gateways, service mesh, metadata endpoints, private ranges, and tool-level URL validation.

## Core knowledge
Application-layer URL validation alone is insufficient because redirects, DNS rebinding, alternate IP encodings, proxies, and compromised dependencies can bypass naïve checks. Layered egress enforcement should occur near the network boundary.

## Procedure
1. Inventory outbound connections required by each capability.
2. Default-deny where operationally practical.
3. Allow only required protocols, ports, and destinations.
4. Block link-local, loopback, metadata, and private ranges unless explicitly required.
5. Resolve and validate destinations consistently; account for redirects and DNS changes.
6. Route generic outbound traffic through an authenticated policy proxy when useful.
7. Separate high-privilege agents into stricter network segments.
8. Restrict package registries and artifact sources in execution sandboxes.
9. Rate-limit unusual connection volumes.
10. Log denied and high-risk egress attempts with workload identity.
11. Test SSRF, redirects, DNS rebinding, alternate address encodings, and direct-IP access.
12. Review allowlists when integrations change.

## Decision points
Prefer tool-specific server-side integrations over arbitrary outbound HTTP. Use broad internet access only for workflows that genuinely require open-web reach.

## Common failure patterns
Allowing all outbound traffic because inbound is blocked, trusting hostname regexes, forgetting IPv6/private ranges, permitting metadata endpoints, and validating only the first redirect target.

## Verification
Prove prohibited addresses remain unreachable from both the agent process and execution sandbox while required integrations remain functional.

## Expected output
An egress policy, approved destination inventory, enforcement architecture, and SSRF/network regression tests.

## Stop conditions
Escalate when required open internet access and sensitive-data access coexist without compensating controls.