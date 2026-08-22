# Research — Credential-Bearing Destination Guard

## Topic
Credential-Bearing Destination Guard

## Category
Security

## Problem
AI agents can supply network destinations as tool arguments. When a tool attaches Basic credentials, OAuth access tokens, API keys, cookies, or other credentials to a request, an attacker who influences the model can redirect that authenticated request to an attacker-controlled host unless the destination is independently constrained.

## Why it matters now
AWS disclosed CVE-2026-18655 on 2026-08-03 in the AWS Labs Amazon MQ MCP Server. Versions through 2.0.23 accepted a model-controlled `broker_hostname` and sent Amazon MQ RabbitMQ credentials or OAuth tokens to that destination. AWS patched the issue in 2.0.24 by removing the free-form hostname and deriving the endpoint from `broker_id` and `region` via the Amazon MQ API. This is a concrete example of prompt injection becoming credential exfiltration through a legitimate, approved tool.

## Affected users
MCP server authors, agent-platform teams, developers building credentialed HTTP tools, connector authors, cloud automation teams, and users who enable auto-approved agent actions.

## Current public evidence
### Observed evidence
1. AWS Security Bulletin 2026-070-AWS, published 2026-08-03, states that a crafted broker hostname could cause Amazon MQ MCP Server versions <=2.0.23 to send broker credentials or OAuth access tokens to an attacker-controlled endpoint. AWS recommends upgrading to 2.0.24 and rotating credentials: https://aws.amazon.com/security/security-bulletins/2026-070-aws/
2. GitHub advisory GHSA-xwj6-8x5h-hjp6 explains that the affected tools passed `broker_hostname` directly into credential-bearing HTTPS requests. The patch replaces the free-form hostname with `broker_id` and `region`, then resolves the trusted endpoint through AWS APIs: https://github.com/awslabs/mcp/security/advisories/GHSA-xwj6-8x5h-hjp6
3. OWASP SSRF guidance recommends positive allowlists for scheme, port, and destination; disabling redirects; validating resolved IPs; and considering DNS rebinding/TOCTOU risks: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
4. OWASP Top 10 SSRF guidance recommends deny-by-default network controls and positive allowlists rather than trusting user-supplied destinations: https://owasp.org/Top10/2021/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/

## Existing approaches
- Prompt the model not to send secrets to unknown hosts.
- Require human confirmation before risky tool calls.
- Validate only the URL scheme or hostname string.
- Use TLS certificate verification.
- Apply a generic SSRF denylist.
- Patch individual tools after a vulnerable destination parameter is found.

## Remaining limitations
Model instructions and confirmation are probabilistic/human-dependent. TLS confirms control of the chosen hostname, not that the hostname is authorized to receive a credential. String-only hostname checks can miss redirects, alternate IP forms, DNS rebinding, and private/link-local destinations. Denylists are difficult to make complete. Per-tool patches do not create a reusable boundary for new tools.

## Root-cause analysis
- Trust is assigned to the tool but not independently to the destination of each credential-bearing request.
- Free-form network locations are allowed to cross from model-controlled arguments into security-sensitive HTTP clients.
- Credential attachment and destination authorization are performed in the same step, so an attacker-controlled argument can redirect the credential.
- Approval often checks the tool name rather than the concrete destination and credential class.
- Destination validation is sometimes performed only before DNS resolution, leaving redirect and rebinding gaps.

## Improvement opportunity
Add a reusable action-time guard before any credential-bearing network request. Prefer service-derived endpoints over model-provided URLs. Otherwise require HTTPS, reject userinfo and nonstandard ports unless explicitly allowed, constrain destinations with exact/suffix allowlists, resolve and reject non-global addresses, disable redirects, bind approval to the normalized destination and credential class, and enforce network egress controls as defense in depth.

## Goal
Prevent prompt-influenced tool arguments from redirecting credentials to an unauthorized destination while preserving legitimate agent integrations.

## Metrics
- 100% credential-bearing requests pass a destination authorization check.
- 0 requests with credentials are sent to unapproved hosts in adversarial tests.
- 0 automatic redirects are followed for credential-bearing requests.
- 100% approvals are bound to normalized destination + credential class + operation.
- 100% rejected requests emit an auditable reason without logging secret values.

## Trigger
Before constructing or sending any outbound request that carries a credential, token, signed header, session cookie, client certificate, or secret-bearing query/body field.

## Inputs
Requested URL/host, operation, credential class, service identity, destination policy, optional approval record, and optional service-discovery result.

## Outputs
`allow`, `approval_required`, or `deny`; normalized destination; evidence; policy rule; and audit-safe reason.

## Interpretation
The AWS incident is a specific vulnerability, not proof that every MCP server has the same flaw. The reusable engineering lesson is that tool authorization is insufficient when a credential-bearing destination remains model-controlled.

## Proposed solution
A deterministic destination guard plus enforceable rules, workflow, hook, tests, and an independent security-review role. The package does not claim application-layer validation alone eliminates SSRF; it explicitly requires defense in depth and prefers trusted endpoint derivation.