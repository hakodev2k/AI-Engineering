# Research — Tool Name Collision Identity Guard

## Topic
Tool Name Collision Identity Guard

## Category
Security / Thinking

## Problem
Agent runtimes can expose multiple function tools or MCP tools whose model-visible names collide. The model may see an ambiguous tool set while dispatch code silently selects one winner, making another tool unreachable or routing a call to an unintended implementation.

## Why it matters now
Current SDKs increasingly aggregate local tools, handoffs, deferred tools, and multiple MCP servers. Cross-server name uniqueness is not guaranteed by MCP, so collision handling must be explicit at the host boundary.

## Affected users
Agent platform developers, MCP client builders, multi-server tool aggregators, coding-agent users, and teams using approval/audit policies keyed by tool name.

## Current public evidence
### Observed evidence
1. OpenAI Agents SDK issue #4116, opened 2026-08-02, documented duplicate `FunctionTool` names being advertised together while dispatch silently shadowed the first. The SDK later added collision policy controls: https://github.com/openai/openai-agents-python/issues/4116
2. OpenAI Agents SDK current docs expose `tool_name_collision_policy`, where `error` can fail before the model call; the default documented behavior is `warn` for unnamespaced collisions: https://github.com/openai/openai-agents-python/blob/main/docs/running_agents.md
3. The MCP 2026-07-28 tools specification states tool-name uniqueness is only scoped to a single server; aggregating clients may encounter collisions and should disambiguate, while `serverInfo.name` itself is not guaranteed unique: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx
4. OpenAI Agents SDK issue #1167 described duplicate tool names across MCP servers causing abnormal agent behavior/hanging, reinforcing the cross-server collision failure mode: https://github.com/openai/openai-agents-python/issues/1167

### Interpretation
Collisions are not merely cosmetic. If approvals, traces, model-visible names, and runtime dispatch use different identity layers, a safe-looking approval can become ambiguous or an unintended callable can win dispatch.

## Existing approaches
- Prefix tool names with server names.
- SDK-specific collision policies.
- Namespaces/qualified names.
- Manual naming conventions.

## Remaining limitations
- Server display names are not guaranteed globally unique.
- Warning-only behavior still permits an ambiguous run.
- Collision checks can miss deferred or dynamically refreshed tools.
- Approval/audit systems may still store only the public name rather than canonical identity.

## Root-cause analysis
1. Public tool names are treated as stable identity.
2. Aggregators flatten independently scoped namespaces.
3. Dynamic tool discovery changes the collision set after startup.
4. Approval and trace keys may differ from dispatch lookup keys.
5. Hosts allow ambiguity to reach the model instead of failing closed.

## Improvement opportunity
Introduce a deterministic preflight that computes a canonical identity from server instance identity + namespace + original tool name, emits a collision-free model-facing name, and blocks any unresolved ambiguity before model invocation. Bind approvals and audit events to the same canonical identity.

## Relevant sources
- https://github.com/openai/openai-agents-python/issues/4116
- https://github.com/openai/openai-agents-python/blob/main/docs/running_agents.md
- https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/tools.mdx
- https://github.com/openai/openai-agents-python/issues/1167

## Goal and metrics
- 0 unresolved duplicate model-visible names.
- 0 dispatch ambiguities in negative tests.
- 100% approval records bound to canonical identity.
- Dynamic tool refresh re-runs collision validation before exposure.

## Trigger / Inputs / Outputs
- Trigger: startup, tool refresh, MCP `tools/list_changed`, deferred-tool load, agent handoff registration.
- Inputs: server instance id, namespace, public name, callable id, approval key.
- Outputs: canonical identity map, model-visible name map, collision report, allow/deny decision.
