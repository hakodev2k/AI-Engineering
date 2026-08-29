# Research Evidence

## Topic
MCP Transport Control-Plane Isolation

## Category
Security

## Problem
MCP application endpoints sometimes accept transport configuration from a less-trusted client and directly convert it into operating-system process launches or server-side network connections. The dangerous transition is not ordinary tool input: it changes what executable runs, where the server connects, and which headers cross the network boundary.

## Why it matters now
Two GitHub-reviewed Chainlit advisories were published on 2026-08-25. They show both major MCP transport families failing at the same architectural boundary: stdio configuration became command execution, while SSE/streamable-http configuration became arbitrary outbound requests. These are concrete production framework vulnerabilities, not hypothetical prompt attacks.

## Affected users
Developers exposing MCP connectivity through agent/web applications; platform teams supporting user-selected MCP servers; multi-tenant agent products; operators running MCP-capable frameworks inside networks with sensitive services; teams forwarding credentials to remote MCP servers.

## Current public evidence
### Observed evidence
1. **Chainlit CVE-2026-45018 / GHSA-w3fx-mc44-mf6j**, published 2026-08-25: before 2.12.0, client-controlled `fullCommand` for stdio was validated only by executable name. Allowed `npx` plus unchecked arguments could execute arbitrary shell commands. Fix: remove command definition from client input and select developer-configured servers by name.
2. **Chainlit CVE-2026-45019 / GHSA-hvfh-5mj3-5f3j**, published 2026-08-25: user-controlled SSE/streamable-http URLs and headers reached outbound MCP clients without destination validation, enabling SSRF and attacker-controlled headers. Fix: opt-in user servers, non-empty allowed URLs, no redirects, per-request re-checking, restricted-header filtering.
3. **auth-fetch-mcp CVE-2026-49857 / GHSA-pvrj-8cg3-j5f8**, reviewed 2026-07-01: IPv4-mapped IPv6 normalization bypassed private/loopback SSRF checks, demonstrating how string/family-specific filtering fails.
4. **Azure MCP Server CVE-2026-26118 / GHSA-hhfx-wfvq-7g9c**, published 2026-03-10: Microsoft patched an MCP SSRF issue, independently confirming destination validation as a recurring MCP boundary.

## Existing approaches
Disable MCP or user-provided servers by default; authenticate management endpoints; keep stdio commands in trusted developer config; allowlist remote URLs; reject unsafe schemes/path tricks; disable redirects and revalidate effective destinations; filter sensitive headers; enforce runtime egress restrictions; upgrade vulnerable framework versions.

## Remaining limitations
Chainlit's own advisory notes that `/mcp` can remain anonymously reachable where no auth callback exists; hostname allowlists do not themselves block DNS names resolving to private/link-local targets; robust resolve-and-pin behavior is needed to avoid DNS TOCTOU; header denylists can miss future or uncommon sensitive headers; authentication alone does not sanitize transport definition; resource exhaustion requires independent process/session limits.

## Root-cause analysis
1. Trust-boundary confusion: transport configuration was modeled as client data though it controls privileged effects.
2. Partial validation: executable checks ignored arguments; URL checks can ignore resolution/redirect behavior.
3. Ambient authority: the host process carries filesystem/network/environment access inherited by transport actions.
4. Validation/runtime split: a safe-looking input can resolve or redirect differently when used.
5. Missing resource governance: even approved servers can be abused through unconstrained process/session creation.

## Interpretation
The reusable problem is broader than any one CVE: applications need a deterministic boundary between **selection of an approved MCP connection** and **definition of a new privileged transport**. The former can be user-driven; the latter should require trusted configuration or an explicit constrained grant.

## Improvement opportunity
Provide a reusable preflight policy validator and workflow that inventories transport entry points, removes client-defined shell commands, canonicalizes remote grants, enforces authentication/session limits, and tests unsafe destinations/headers without relying on LLM judgment.

## Relevant sources
- https://github.com/advisories/GHSA-w3fx-mc44-mf6j
- https://github.com/advisories/GHSA-hvfh-5mj3-5f3j
- https://github.com/advisories/GHSA-pvrj-8cg3-j5f8
- https://github.com/advisories/GHSA-hhfx-wfvq-7g9c
- https://github.com/Chainlit/chainlit/releases/tag/2.12.0

## Evidence boundary
The proposed package generalizes from the cited failure modes; it does not claim every MCP framework is vulnerable. Runtime DNS pinning and firewall enforcement remain separate controls and are not claimed solved by the static validator.
