# Research Evidence

## Topic
MCP SSRF Resolution and Redirect Guard

## Category
Security

## Problem
MCP tools that fetch caller- or model-controlled URLs continue to expose server-side request forgery (SSRF) paths. Naive checks such as blocking literal `127.0.0.1`, checking only the original hostname, or relying on one URL parser are insufficient because attackers can use IPv4-mapped IPv6 forms, DNS resolution changes, redirects, link-local metadata endpoints, or alternate numeric representations to reach internal services.

## Why it matters now
Several independent 2026 disclosures show the same failure class across different MCP implementations. On 2026-08-14, CVE-2026-19753 was published for `mcp-rdf-explorer` where an attacker-controlled URL reaches an SSRF sink. On 2026-08-25, Chainlit disclosed CVE-2026-45019: its MCP endpoint accepted a user-controlled URL and headers and could make unauthenticated outbound requests to arbitrary internal services and cloud metadata. Earlier 2026 advisories show that even implementations with an SSRF filter can be bypassed by IPv4-mapped IPv6 normalization, and the Model Context Protocol servers repository has open reports about fetch-server SSRF exposure.

## Affected users
Developers of MCP servers and fetch/browser tools; operators exposing MCP over HTTP/SSE; cloud-hosted agent platforms; teams allowing untrusted retrieved content or prompt-influenced tool arguments; and users running local MCP servers near sensitive loopback services.

## Current public evidence

### Observed evidence
1. **CVE-2026-19753 / GHSA-274v-3mgv-hg6c**, published 2026-08-14, reports SSRF in `mcp-rdf-explorer` 1.0.0 through the `explore_url` argument.
2. **CVE-2026-45019 / GHSA-hvfh-5mj3-5f3j**, published 2026-08-25, reports SSRF in Chainlit MCP SSE/streamable-HTTP transports. The endpoint accepted arbitrary URLs and attacker-controlled headers, including requests to internal services and cloud metadata.
3. **CVE-2026-49857 / GHSA-pvrj-8cg3-j5f8**, reviewed 2026-07-01, documents an SSRF protection bypass in `auth-fetch-mcp` using IPv4-mapped IPv6 loopback normalization such as `::ffff:127.0.0.1` becoming `::ffff:7f00:1`.
4. Model Context Protocol server issue **#4143**, opened 2026-05-12, reports that fetch-style MCP servers can expose cloud metadata credentials when arbitrary URL fetching lacks scheme/host/network controls.

### Interpretation
The recurring weakness is not merely “missing a blocklist.” Correct SSRF defense for agent-controlled URL fetches must validate every network destination after canonicalization and resolution, repeat the validation after redirects, reject unsafe address classes, and avoid forwarding sensitive caller-controlled headers across trust boundaries. A filter that validates only the textual URL before DNS/redirect processing is incomplete.

### Proposed solution
Create a reusable guard contract and deterministic reference validator that enforces allowed schemes, canonical hostname handling, resolved-IP policy, IPv4-mapped IPv6 normalization, redirect revalidation, and explicit header policy. Require measurable tests for private, loopback, link-local, metadata, multicast, reserved, and safe public destinations.

## Existing approaches
- Patch or upgrade the affected MCP package.
- Use literal hostname/IP blocklists.
- Disable remote fetching or MCP entirely.
- Put the MCP server behind a proxy/firewall with egress restrictions.
- Validate initial URLs with a URL parser.

## Remaining limitations
- Literal blocklists miss DNS-resolved private addresses and parser normalization tricks.
- Validating only the first URL misses redirect pivots.
- Network firewalls may not distinguish approved public destinations from internal addresses reachable through the same egress path.
- Package upgrades protect a specific implementation but do not cover custom MCP tools or wrappers.
- Header forwarding can leak bearer tokens/cookies even when the destination itself appears allowed.

## Root-cause analysis
1. **Validation before resolution:** applications approve a hostname without evaluating every resolved address.
2. **Canonicalization mismatch:** URL parsers, IP parsers, and HTTP clients normalize addresses differently.
3. **Redirect trust inheritance:** a safe initial URL is treated as authorizing later destinations.
4. **Implicit header propagation:** credentials supplied to one origin are forwarded to another.
5. **Tool argument trust confusion:** model-generated arguments are treated as operator intent even when they originate from untrusted content.
6. **Insufficient adversarial tests:** test suites cover ordinary URLs but not IPv4-mapped IPv6, link-local, metadata, DNS rebinding simulations, or redirect chains.

## Improvement opportunity
Standardize a destination-verification gate executed at each connection attempt. The gate should normalize the host, resolve it, reject any unsafe IP among candidate addresses, pin the connection to a validated address when the HTTP stack permits, re-run validation after every redirect, and strip sensitive headers unless the new origin is explicitly approved.

## Goal
Block agent-controlled requests from reaching loopback, private, link-local, multicast, reserved, unspecified, and metadata destinations while preserving legitimate public HTTP/HTTPS retrieval.

## Metrics
- Unsafe-address test rejection rate: 100%.
- Public fixture acceptance rate: 100% for approved fixtures.
- Redirect-hop revalidation coverage: 100%.
- Sensitive-header cross-origin forwarding violations: 0.
- Unvalidated outbound connection attempts in instrumentation: 0.
- Security regression test pass rate: 100%.

## Trigger
Use when adding or modifying an MCP tool that accepts URLs, enabling remote MCP transport that can initiate outbound requests, adding browser/fetch functionality, or reviewing an existing agent egress path.

## Inputs
Candidate URL, resolved IP set, redirect target(s), outbound header set, allowed schemes, optional hostname allowlist, and deployment network policy.

## Outputs
Allow/deny decision with reason, normalized destination evidence, redirect decisions, header-forwarding decision, and verification report.

## Relevant sources
- GitHub Advisory Database, CVE-2026-19753 / GHSA-274v-3mgv-hg6c: https://github.com/advisories/GHSA-274v-3mgv-hg6c
- GitHub Advisory Database, CVE-2026-45019 / GHSA-hvfh-5mj3-5f3j: https://github.com/advisories/GHSA-hvfh-5mj3-5f3j
- GitHub Advisory Database, CVE-2026-49857 / GHSA-pvrj-8cg3-j5f8: https://github.com/advisories/GHSA-pvrj-8cg3-j5f8
- Model Context Protocol servers issue #4143: https://github.com/modelcontextprotocol/servers/issues/4143
- Model Context Protocol servers issue #3741: https://github.com/modelcontextprotocol/servers/issues/3741
