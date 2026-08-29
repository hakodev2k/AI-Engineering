# MCP Transport Control-Plane Isolation

**Category:** Security  
**Run date:** 2026-08-30 (UTC+7)

## Problem
MCP-enabled applications can accidentally treat client-supplied transport configuration as ordinary data even though it controls process creation, outbound network destinations, and credential-bearing headers. Recent vulnerabilities show that validating only an executable name or only the first URL is insufficient: transport configuration is a control plane and must stay on the trusted side of the boundary.

## Evidence
See `evidence/research.md`. The strongest current signals are Chainlit CVE-2026-45018 (client-controlled stdio command leading to RCE) and CVE-2026-45019 (client-controlled SSE/streamable-http URL and headers leading to SSRF), both published August 25, 2026. Independent SSRF evidence exists in `auth-fetch-mcp` CVE-2026-49857 and Azure MCP Server CVE-2026-26118.

## Existing approach
Chainlit 2.12.0 moved stdio commands to developer configuration, made user-provided remote MCP servers opt-in with an explicit URL allowlist, stopped redirects, and re-checks outgoing transport requests. Network egress controls and authentication are also recommended defense-in-depth measures.

## Remaining limitations
A URL allowlist alone does not prove that DNS resolution stays outside private/link-local/metadata ranges. Header denylists are weaker than positive allowlists. Authentication does not convert untrusted transport configuration into trusted configuration. Process/session resource limits also need independent enforcement.

## Proposed improvement
Treat MCP transport configuration as a privileged control plane: clients select predeclared server identities; user-defined remote servers are disabled by default; URLs are canonicalized and constrained; restricted forwarding headers are rejected; authentication/session limits are required; runtime egress remains a second boundary.

## Package tree
```text
README.md
evidence/research.md
config/policy.example.json
skills/mcp-transport-threat-model.md
rules/transport-control-plane-rules.md
subagents/security-reviewer.md
workflows/research-diagnose-harden.md
hooks/preflight-mcp-policy.md
scripts/validate_mcp_policy.py
tests/test_validate_mcp_policy.py
```

## Installation
Python 3.10+; standard library only.

## Usage
```bash
python scripts/validate_mcp_policy.py config/policy.example.json
python -m unittest tests/test_validate_mcp_policy.py
```

## Metrics
Authenticated MCP session coverage; predeclared-stdio usage; rejected ungranted destinations; blocked unsafe IP literals/headers; concurrent-session bound; regression-test pass rate.

## Verification
**Implemented:** policy and deterministic validation exist. **Measured:** baseline and hardened behavior are captured against the same test matrix. **Verified:** untrusted commands/URLs/headers are blocked while approved MCP servers still connect and runtime egress/auth boundaries remain intact.

## Safety
Tests MUST use harmless local fixtures. Never probe third-party, metadata, internal, or production services without explicit authorization. Never weaken authentication, network isolation, or command restrictions to make tests pass.

## Failure handling
Any policy-validation failure blocks rollout. Fix and retry at most twice. If approved functionality cannot be represented safely, preserve deny-by-default behavior and escalate for human design review.

## Definition of Done
Evidence documented; entry points inventoried; trust boundaries explicit; validator/tests pass; command, URL, header, auth and resource-limit cases covered; no secrets logged; approved connections work; independent verification passes; no blocking issue remains.
