# Research — MCP OAuth Metadata SSRF Guard

## Problem
Remote MCP clients routinely fetch OAuth/protected-resource metadata whose URLs and nested endpoint URLs may be influenced by an untrusted or compromised MCP server. If a client follows those URLs without network-boundary validation, it can be induced to access private services, loopback listeners, link-local/cloud metadata endpoints, or unsafe URL schemes. The same trust mistake can also occur after redirects or DNS re-resolution.

## Category
Security.

## Why it matters now
The MCP 2026-07-28 security guidance explicitly documents SSRF risk during OAuth metadata discovery and recommends HTTPS plus blocking private/reserved address ranges. At the same time, production MCP implementations continue to report URL-fetching and authorization-endpoint validation gaps.

## Current public signals

### Signal 1 — official MCP security guidance
The Model Context Protocol security best-practices document for the 2026-07-28 specification calls out SSRF during OAuth metadata discovery. It identifies attacker-influenced `resource_metadata`, `authorization_servers`, `token_endpoint`, `authorization_endpoint`, and related URLs, and recommends HTTPS plus blocking private/reserved IP ranges.

Source: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/docs/2026-07-28/tutorials/security/security_best_practices.mdx

### Signal 2 — MCP fetch server credential-exposure report
`modelcontextprotocol/servers#4143`, opened 2026-05-12, reports that MCP HTTP/fetch tools can accept arbitrary URLs without scheme/host protections and can reach cloud metadata services, potentially exposing IAM credentials on susceptible hosts.

Source: https://github.com/modelcontextprotocol/servers/issues/4143

### Signal 3 — Codex unsafe authorization endpoint scheme
`openai/codex#37077`, opened 2026-08-05, reports that MCP OAuth login can open a server-supplied `authorization_endpoint` through the OS browser without a URL-scheme allowlist. Although this is not identical to server-side SSRF, it demonstrates the same class of metadata-as-authority trust failure: endpoint URLs from remote metadata require independent policy validation before use.

Source: https://github.com/openai/codex/issues/37077

## Existing approaches
- Require HTTPS for production OAuth endpoints.
- Block direct private, loopback, link-local, multicast, documentation and reserved IP ranges.
- Validate protected-resource and authorization-server metadata according to OAuth/MCP specifications.
- Use general-purpose HTTP-client redirect controls.
- Rely on cloud metadata hardening such as IMDSv2 where available.
- Use network firewalls, egress policies, proxies or sandboxes.

## Observed limitations
- Scheme-only validation does not stop `https://` hosts resolving to private addresses.
- Validating only the original hostname does not stop redirects to disallowed destinations.
- A single DNS lookup before the request leaves a DNS-rebinding/time-of-check-time-of-use gap unless the connection is pinned or the peer address is verified.
- Generic HTTP clients commonly follow redirects automatically unless explicitly constrained.
- Cloud metadata hardening is provider/host dependent and is not a client-side trust boundary.
- Prompt instructions cannot reliably secure deterministic network behavior.
- Blocking only RFC1918 misses loopback, link-local, IPv6 local ranges, unspecified addresses and other non-global destinations.

## Root-cause hypotheses
1. MCP/OAuth metadata is treated as configuration rather than untrusted input.
2. URL validation is lexical instead of resolution-aware.
3. Redirect validation is delegated to permissive HTTP-client defaults.
4. Endpoint validation is implemented separately for each discovery stage, creating inconsistent gaps.
5. Tests cover happy-path OAuth interop but not adversarial DNS/address/redirect cases.

## Improvement target
Create one reusable boundary that validates every metadata-derived URL before network or browser use. It should:
- allow only configured schemes;
- reject embedded credentials;
- validate hostname and explicit IP literals;
- resolve hostnames and reject non-global addresses unless explicitly allowlisted;
- revalidate every redirect target;
- optionally verify the connected peer IP;
- cap redirects, response size and timeout;
- separate browser-navigation endpoints from server-fetch endpoints;
- emit auditable reason codes without secrets;
- fail closed on ambiguity.

## Success metrics
- 100% of adversarial private/loopback/link-local fixtures are blocked.
- 100% of redirect-to-private fixtures are blocked.
- Browser endpoints with disallowed schemes are blocked.
- Approved public HTTPS metadata endpoints continue to work.
- No network request is made for a URL that fails preflight.
- Every block decision contains a deterministic reason code.
- Bounded retries: zero automatic retries for policy failures; at most one retry for transient DNS/network failures outside policy evaluation.

## Observed evidence vs interpretation vs proposal
**Observed evidence:** official MCP guidance documents OAuth-discovery SSRF; public issues document MCP URL-fetching credential exposure and unsafe authorization-endpoint scheme handling.

**Interpretation:** implementations repeatedly need a single URL trust boundary that spans discovery, redirects and browser navigation rather than ad-hoc checks per endpoint.

**Proposed engineering solution:** a deterministic policy engine plus safe-fetch wrapper, adversarial tests, hooks and integration workflow contained in this package.
