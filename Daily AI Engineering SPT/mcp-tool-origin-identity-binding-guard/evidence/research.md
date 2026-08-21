# Research — MCP Tool Origin Identity Binding Guard

## Category
Security

## Problem
MCP hosts frequently aggregate tools from multiple servers, sessions, transports, plugins, or proxies. A visible tool name is not a globally unique security identity. If routing, approval, policy, audit, or caching keys are based on display names or server-reported names alone, a collision or stale mapping can make an invocation resolve to the wrong capability or origin.

## Why this matters now
The MCP 2026-07-28 specification explicitly states that tool-name uniqueness is scoped only to one server, aggregated clients may encounter collisions, and `serverInfo.name` is not guaranteed to be unique. The same release tells clients to treat tool annotations as untrusted unless they come from trusted servers. These are protocol-level signals that a host must add its own origin-aware identity layer.

## Current public signals

### Observed evidence
1. **MCP tools specification, 2026-07-28.** Tool names are only unique within a server. Aggregating clients may encounter collisions and should disambiguate. The server-reported name is not guaranteed unique and should not be relied on for disambiguation. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx
2. **MCP naming SEP / issue #1395.** The proposal documents cross-client naming ambiguity, logical overriding, namespace injection, and possible unintended privilege escalation when names are normalized or concatenated ambiguously. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1395
3. **Claude Code issue #28093.** A report describes concurrent Claude Code sessions routing an MCP call to the wrong Codex MCP server process/project, demonstrating that process/session origin matters independently of the logical tool name. Source: https://github.com/anthropics/claude-code/issues/28093
4. **MCP security review issue #3180.** The review flags tool-name shadowing because the protocol does not provide a cross-server namespace. Source: https://github.com/modelcontextprotocol/modelcontextprotocol/issues/3180
5. **Claude Code issue #10708.** Subagent tool construction can fail because tool names must be unique when MCP tools are duplicated/collide. This is primarily reliability evidence, but it reinforces that host aggregation must handle identities deterministically. Source: https://github.com/anthropics/claude-code/issues/10708

## Existing approaches
- Prefix tools with a server label.
- Depend on framework-generated names such as `mcp__server__tool`.
- Keep per-connection registries and dispatch through the active connection object.
- Reject duplicate names at registration.
- Rely on user configuration names as the server identifier.

## Observed limitations
- A **server label is not a stable security identity** if two configurations can reuse it or if a proxy reports the same `serverInfo.name`.
- String concatenation can be ambiguous when components are normalized differently or separators appear in names.
- Rejecting duplicates detects some failures but does not prove that approval, audit, and dispatch resolve to the same origin.
- Per-session registries can still become stale or cross-wired when process/session ownership is not included in identity.
- Display-name prefixes improve UX but are insufficient as authorization keys.

## Root-cause hypotheses
1. Tool identity is modeled as a presentation string instead of a structured security principal.
2. Connection/session ownership is not carried through approval and dispatch.
3. Registry normalization occurs after policy decisions, producing different keys across layers.
4. Dynamic re-registration replaces a tool entry without forcing re-approval or invalidating cached policy.
5. Audit logs record only display names, making wrong-origin invocation difficult to detect.

## Improvement target
Introduce a host-controlled canonical tool identity derived from trusted configuration and live connection context, not from server-reported names alone. Bind registry, approval, policy, dispatch, audit, and cache entries to the same immutable identity tuple and fingerprint.

Recommended tuple:
- host-assigned `server_instance_id`
- transport identity (`stdio` command/cwd fingerprint or normalized remote origin)
- connection/session generation
- exact protocol tool name
- input-schema digest

A human-readable alias remains separate and never serves as an authorization key.

## Success metrics
- 100% of registered tools have a canonical identity and origin fingerprint.
- 0 ambiguous display aliases reach dispatch.
- 0 approvals are reusable after origin/schema fingerprint changes.
- 100% of tool invocation audit records include canonical identity, alias, origin fingerprint, and connection generation.
- Collision and stale-generation fixtures are denied before tool execution.
- Independent verifier confirms policy lookup identity equals dispatch identity.

## Interpretation
The public evidence does not prove every MCP client is exploitable. It does show that cross-server uniqueness is intentionally not guaranteed and that real implementations have experienced collisions and wrong-server routing. Therefore hosts that aggregate MCP capabilities should treat origin binding as a security invariant rather than a naming convention.

## Proposed engineering solution
This package adds deterministic identity derivation, catalog collision auditing, policy/approval binding, generation checks, and verification workflows. It does not modify MCP wire semantics and does not trust model reasoning to resolve identity ambiguity.