# Research — MCP Fetch SSRF Egress Guard

## Topic
MCP Fetch SSRF Egress Guard

## Category
Security

## Problem
Network-capable MCP tools that accept model-controlled URLs can become SSRF primitives. A prompt-injected agent may be coerced into requesting cloud metadata, loopback, RFC1918, link-local, or otherwise sensitive endpoints and then returning credentials or internal data to the model.

## Why it matters now
A public issue against `modelcontextprotocol/servers` documented that `mcp-server-fetch` and a community HTTP-request server accepted arbitrary URLs without scheme/host protections and could expose cloud metadata credentials on susceptible hosts. The report explicitly noted prompt-influenced tool arguments as part of the MCP threat model and proposed URL/IP validation. This is reinforced by OWASP SSRF guidance recommending allowlisting where possible and blocking internal/reserved address ranges after DNS resolution.

## Affected users
Teams hosting MCP servers on cloud VMs/containers, agent platforms exposing generic HTTP fetch tools, developers integrating third-party MCP servers, and users whose agents can read retrieved content or invoke follow-up tools.

## Current public evidence
### Observed evidence
1. `modelcontextprotocol/servers` issue #4143, opened 2026-05-12, reports missing SSRF protections in `mcp-server-fetch` and describes cloud metadata exposure risk: https://github.com/modelcontextprotocol/servers/issues/4143
2. A related MCP server security discussion (#4234) highlights unrestricted URL parameters, credential exposure, prompt injection, and the need for URL allowlisting/default-safe behavior: https://github.com/modelcontextprotocol/servers/issues/4234
3. OWASP SSRF Prevention Cheat Sheet recommends validating domains/IPs, avoiding arbitrary destinations where possible, and blocking requests to local/internal networks when a strict allowlist is not feasible: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html

## Existing approaches
- Trust model-generated URLs and call an HTTP client directly.
- Block obvious metadata hostnames only.
- Use cloud-specific metadata hardening such as IMDSv2.
- Add a static hostname denylist.
- Rely on network firewalls or container isolation.

## Remaining limitations
Hostname-only checks are bypassable through direct IPs, IPv6, DNS rebinding, alternative numeric encodings, redirects, and newly introduced internal services. Cloud metadata protections are provider-specific. Firewalls help but do not provide application-level evidence about why a request was allowed. Generic prompt-injection detection does not deterministically constrain network egress.

## Root-cause analysis
- URL destinations are treated as content instead of capabilities.
- Validation may occur before DNS resolution but not after it.
- Redirect targets are often not revalidated.
- Agents commonly inherit the host's broad network reach.
- Internal network access is enabled by default rather than explicit policy.
- Logging records the URL but not the resolved addresses and policy decision.

## Improvement opportunity
Introduce a deterministic egress gate before every fetch and after every redirect. Permit only HTTP(S), normalize hostnames, resolve all addresses, reject loopback/private/link-local/multicast/unspecified/reserved networks by default, optionally enforce domain allowlists, cap redirects, and emit an auditable decision. Keep internal-network access opt-in and narrowly scoped.

## Goal
Prevent model-controlled URL fetches from reaching sensitive network destinations unless explicitly authorized by policy.

## Metrics
- 100% outbound MCP fetches pass through the guard.
- 100% redirect targets are revalidated.
- 0 requests to blocked address classes in adversarial tests.
- 100% decisions log normalized host, resolved IPs, rule, and outcome without secrets.
- Benign public HTTP(S) fixtures remain reachable under policy.

## Trigger
Any MCP/network tool call that can initiate an outbound URL request or follow an HTTP redirect.

## Inputs
URL, policy, DNS results, redirect target, optional explicit domain allowlist, and request correlation ID.

## Outputs
`allow` or `deny`, normalized destination, resolved addresses, reason codes, and audit metadata.

## Interpretation
The evidence supports a concrete MCP deployment hazard, not a claim that every fetch server is exploitable. Exposure depends on deployment network reach and implementation details.

## Proposed solution
A reusable DNS-aware URL gate, enforceable policy, pre-fetch hook, verification workflow, and regression tests. The guard complements—not replaces—network-level egress controls and cloud metadata hardening.