# Research — MCP Credential Destination Binding Guard

## Topic
MCP credential destination binding for tools that initiate authenticated outbound connections.

## Category
Security

## Problem
An MCP tool can accept a model-controlled hostname or URL and then attach broker credentials, OAuth tokens, API keys, or other caller credentials to the outbound request. If the destination is not deterministically constrained, prompt injection or malicious retrieved content can redirect those credentials to an attacker-controlled endpoint.

## Why it matters now
A concrete August 2026 advisory affected the AWS Labs Amazon MQ MCP server. The vulnerable tools accepted `broker_hostname` and sent authenticated HTTPS requests without validating that the destination was an Amazon MQ broker. This turned a tool argument influenced by the model into a credential-exfiltration path. The issue was fixed in version 2.0.24, but the failure mode is reusable across MCP servers and agent tools that combine model-selected destinations with ambient credentials.

## Affected users
MCP server authors, agent-platform builders, teams exposing cloud/admin tools to LLMs, users of connectors that make authenticated network requests, and security reviewers.

## Observed evidence
1. GitHub Security Advisory GHSA-xwj6-8x5h-hjp6, published 2026-08-03, reports credential/OAuth token disclosure in `awslabs.amazon-mq-mcp-server` versions <=2.0.23 because `broker_hostname` could select an arbitrary endpoint while the request carried credentials. Patched in 2.0.24: https://github.com/awslabs/mcp/security/advisories/GHSA-xwj6-8x5h-hjp6
2. OpenAI prompt-injection guidance recommends limiting agent access, constraining consequential actions, treating untrusted external content as data rather than authority, and using layered defenses because model-level prompt defenses are not sufficient alone: https://openai.com/safety/prompt-injections/
3. MCP security guidance emphasizes explicit authorization, least privilege, and treating server/tool metadata as untrusted unless trust is established: https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices

## Existing approaches
- Validate input syntax only.
- Rely on TLS without constraining the hostname.
- Let the model decide whether a destination is safe.
- Vet an MCP server once at installation time.
- Require user confirmation for some high-impact tool calls.
- Apply generic prompt-injection detection.

## Remaining limitations
TLS authenticates the destination selected by the request; it does not prove that the selected destination is authorized to receive a particular credential. Model-only checks are probabilistic. Installation-time trust does not ensure each runtime argument is safe. Human confirmation is unreliable if the UI does not clearly surface the credential-bearing destination. Generic injection detectors can miss attacks and do not establish a network authorization boundary.

## Root-cause analysis
- Ambient credentials are attached after a model-controlled destination has been accepted.
- Destination authorization is not bound to the credential scope.
- Hostname validation is absent or syntactic rather than policy-based.
- Redirects, userinfo, raw IP literals, and alternate ports can bypass naive allowlists.
- Approval records often authorize a tool name, not the exact destination and credential class.
- Logging may omit normalized destination and approval binding, weakening incident analysis.

## Improvement opportunity
Add a deterministic pre-request guard that normalizes the URL/hostname, requires HTTPS, rejects userinfo and unauthorized ports, blocks raw IPs unless explicitly allowed, matches the destination against a credential-specific allowlist, and binds any required approval to the normalized destination plus credential class. Re-check after redirects or disable redirects for credential-bearing initialization flows.

## Goal
Ensure credentials can only be transmitted to destinations explicitly authorized for that credential class, independent of model instructions.

## Metrics
- 100% credential-bearing outbound requests pass a deterministic destination policy check.
- 0 credentials sent to unapproved hosts in adversarial tests.
- 100% approvals bind destination + credential class + operation.
- 100% redirects are blocked or revalidated before credential forwarding.
- Security regression fixtures pass.

## Trigger
Before any MCP/tool operation creates an authenticated outbound request whose destination is influenced by model, user, retrieved, or server-provided content.

## Inputs
Destination URL/hostname, credential class, operation, configured allowlist, port/TLS policy, optional approval record.

## Outputs
`allow`, `approval_required`, or `deny`; normalized destination; policy reason; approval-binding key; audit fields.

## Interpretation
The advisory demonstrates a specific real exploit class, not that all MCP servers are vulnerable. The general engineering lesson is that credentials and destinations need an explicit deterministic binding at the network boundary.

## Proposed solution
A reusable credential-destination policy, validation skill, specialized reviewer, bounded implementation workflow, blocking pre-request hook, deterministic Python validator, and regression fixtures described by this package.

## Relevant sources
- https://github.com/awslabs/mcp/security/advisories/GHSA-xwj6-8x5h-hjp6
- https://openai.com/safety/prompt-injections/
- https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices
