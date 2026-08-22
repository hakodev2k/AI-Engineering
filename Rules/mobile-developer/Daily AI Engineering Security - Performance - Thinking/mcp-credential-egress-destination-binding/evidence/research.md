# Research — MCP Credential Egress Destination Binding

## Topic
MCP Credential Egress Destination Binding

## Category
Security

## Problem
MCP tools that accept a caller-controlled hostname or URL can accidentally attach broker credentials, OAuth access tokens, API keys, or other authorization headers to an attacker-controlled destination. The tool invocation may appear legitimate while the network boundary is not constrained to the intended service.

## Why it matters now
A concrete August 2026 advisory in the AWS Labs Amazon MQ MCP Server showed that broker credentials or OAuth tokens could be sent to an arbitrary endpoint when the broker hostname supplied to a tool call was not validated against Amazon MQ destinations. The affected versions were patched in 2.0.24. This is a reusable agent/tool security problem because LLMs routinely compose tool arguments from untrusted natural language and retrieved content.

## Affected users
MCP server authors, agent platform teams, enterprise connector builders, developers exposing authenticated HTTP tools, and users granting agents credentials to cloud services.

## Current public evidence
### Observed evidence
1. GitHub Security Advisory GHSA-xwj6-8x5h-hjp6, published 2026-08-03, reports credential/OAuth token disclosure in AWS Labs Amazon MQ MCP Server when caller-controlled `broker_hostname` was used to build HTTPS requests carrying Authorization headers. Affected `<=2.0.23`, patched `2.0.24`: https://github.com/awslabs/mcp/security/advisories/GHSA-xwj6-8x5h-hjp6
2. OWASP SSRF guidance recommends allowlisting trusted destinations, validating resolved IPs, preventing redirects to untrusted networks, and separating user-supplied destinations from credential-bearing requests: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
3. MCP security guidance emphasizes treating tool inputs and remote servers as trust boundaries and applying least privilege/explicit user authorization: https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices

## Existing approaches
- Validate URLs syntactically.
- Restrict schemes to HTTPS.
- Rely on DNS names or cloud endpoint patterns.
- Use generic SSRF filters.
- Require human approval before executing sensitive tools.

## Remaining limitations
Syntax validation does not bind credentials to a known service. DNS rebinding, redirects, alternate ports, punycode/Unicode host confusion, IP literals, userinfo segments, or over-broad wildcard matching can bypass naive checks. Human approval may confirm the high-level action without exposing the final resolved network destination. Generic SSRF defenses often operate after credentials have already been attached to a request object.

## Root-cause analysis
- Authentication material is added before destination authorization is finalized.
- Tool schemas allow arbitrary destinations when only service-owned endpoints are required.
- Validation happens on the textual hostname but not on canonicalized host/port/scheme and resolved IPs.
- Redirect behavior is inherited from HTTP clients without a separate trust check.
- Tests cover happy-path connectivity more often than credential egress abuse cases.

## Improvement opportunity
Bind each credential class to an explicit destination policy before constructing any authenticated request. Canonicalize scheme/host/port, reject userinfo/IP literals unless explicitly allowed, resolve DNS, enforce network-range policy, disable or revalidate redirects, and only then attach credentials. Emit an auditable destination-binding decision before network I/O.

## Goal
Prevent secret-bearing requests from leaving approved service boundaries even when tool arguments are attacker-influenced.

## Metrics
- 100% credential-bearing requests receive a destination-binding decision.
- 0 test fixtures can exfiltrate credentials to unapproved hosts, redirect targets, or prohibited IP ranges.
- 100% redirects are disabled or revalidated.
- 100% denied requests fail before credential attachment/network I/O.

## Trigger
Any MCP/tool execution that may create an outbound authenticated request using a caller-influenced URL, hostname, port, endpoint, or redirect.

## Inputs
Credential class, destination URL/host, policy, DNS results, redirect target if any, tool name, caller/user intent.

## Outputs
Canonical destination, allow/deny decision, matched policy rule, resolved addresses, audit record, and optionally safe request parameters without secrets.

## Interpretation
The AWS advisory is evidence of a concrete implementation failure, not proof that all MCP servers are vulnerable. It demonstrates a recurring trust-boundary class: credentials must be bound to destination identity independently of model/tool intent.

## Proposed solution
A reusable deterministic destination-binding guard, policy format, adversarial test fixtures, and pre-network hook that fails closed before secrets are attached.

## Relevant sources
- https://github.com/awslabs/mcp/security/advisories/GHSA-xwj6-8x5h-hjp6
- https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices
