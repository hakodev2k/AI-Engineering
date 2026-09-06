# Research

## Topic
OGX MCP Server URL SSRF Guard

## Category
Security

## Problem
An agent API may accept an MCP server URL from a caller and make a privileged server-side connection without applying the same destination checks used for other URL inputs.

## Why it matters now
GitHub Advisory Database published GHSA-9mg6-c5wp-2g44 / CVE-2026-85666 on 2026-09-04 with CVSS 8.7. The advisory states that OGX `/v1/responses` accepts MCP `server_url`, headers and authorization values and can connect to arbitrary internal addresses when URL validation is absent. A current secondary analysis also noted that `validate_url_not_private()` already protected sibling image/RAG fetches, making the inconsistency an observable root cause rather than a theoretical design concern.

## Affected users
Agent API maintainers, MCP clients/gateways, platform teams exposing OpenAI-compatible Responses APIs, cloud-hosted agent runtimes, and tenants sharing internal network reachability.

## Current public evidence
### Observed evidence
1. GitHub Advisory Database, 2026-09-04: GHSA-9mg6-c5wp-2g44, CVE-2026-85666, CWE-918, high severity 8.7; caller-supplied `server_url` is fetched server-side without destination validation and can target metadata/internal addresses.
2. Public issue/advisory references identify OGX issue #6287 and affected source around v1.3.1.
3. Independent current analysis reports the codebase already had a private-URL validator on sibling fetch paths but omitted it from MCP connection setup.

### Interpretation
The root failure is policy inconsistency across URL-bearing features. Treating MCP server selection as a benign tool choice accidentally grants network authority to the caller.

## Existing approaches
Private-address validators, outbound proxies, firewall deny rules, authentication, allowlists and cloud metadata protections.

## Remaining limitations
A validator on only some URL paths leaves bypasses. String checks can miss DNS rebinding, IPv6 forms, redirects and canonicalization. Forwarded authorization headers can also leak credentials to attacker-selected destinations.

## Root-cause analysis
1. MCP server selection was not modeled as SSRF-sensitive input.
2. Security validation was duplicated per feature instead of centralized at the egress boundary.
3. Effective destination after DNS/redirect was not part of authorization.
4. Caller-provided headers/authorization were coupled to caller-provided routing.

## Improvement opportunity
Centralize MCP outbound authorization and require every transport to call one fail-closed gate before connection and after redirects. Separate destination authorization from credential forwarding.

## Relevant sources
- https://github.com/advisories/GHSA-9mg6-c5wp-2g44
- https://nvd.nist.gov/vuln/detail/CVE-2026-85666
- https://github.com/ogx-ai/ogx/issues/6287
- https://github.com/ogx-ai/ogx/blob/v1.3.1/src/ogx/providers/utils/tools/mcp.py
