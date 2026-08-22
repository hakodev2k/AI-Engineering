# Research

## Problem
AI-agent approval controls are often implemented per tool adapter rather than at a single host-side capability boundary. The same dangerous operation can therefore behave differently depending on whether it travels through a terminal tool, MCP wrapper, delegated subagent, or another transport. This creates two failure classes: side-effecting operations that bypass approval entirely, and approval requests that are emitted into a path where no human or guardian can answer them.

## Category
Security.

## Why it matters now
Tool-rich coding agents increasingly compose terminal execution, MCP servers, background/subagents, remote execution, filesystem and deployment tools. That increases the number of routing paths that must preserve exactly the same authorization semantics.

## Current public signals
1. NousResearch/hermes-agent issue #32877 (opened 2026-05-26) reports that `approval.py` is consulted by `terminal_tool` but MCP wrappers such as ssh/docker can invoke subprocesses without the dangerous-command / Smart-mode gate or audit entry. The issue provides a reproducible route-equivalence failure: the same destructive operation is gated through terminal but not through MCP.
2. openai/codex issue #31565 (opened 2026-07-08) reports the opposite class: delegated review/subagent MCP calls that require approval can hang indefinitely because an `ElicitationRequest` is emitted into a delegated path that has no responder. The reporter shows the same MCP tool works in ordinary interactive execution but wedges in delegated review execution.
3. Anthropic Claude Code issue #81362 (opened 2026-07-26) reports MCP calls returning `needs_approval` even after user approval, demonstrating that approval state can diverge across client/proxy layers.
4. The MCP specification defines `readOnlyHint`, `destructiveHint`, `idempotentHint`, and `openWorldHint`, but explicitly states that these are hints and clients must not make security decisions from annotations supplied by untrusted servers.
5. The MCP Tool Annotations working-group post (2026-03-16) reiterates that annotations are not enforcement and recommends deterministic host-layer controls for guarantees.

## Existing approaches
- Adapter-specific permission checks in terminal, filesystem, MCP, browser, deployment, or remote-exec tools.
- Tool annotations that describe expected behavior.
- Allow/deny lists and permission modes.
- Human approval prompts implemented by the UI or transport.
- Sandbox restrictions that reduce impact after a bad decision.

## Observed limitations
- Adapter-local checks are bypassable whenever a new wrapper reaches the same capability through a different path.
- Annotations are untrusted hints, not authority.
- Approval state can be lost or duplicated across parent/subagent/proxy boundaries.
- Interactive-only prompt plumbing fails in non-interactive or delegated execution.
- Allow lists identify tool names, while real risk belongs to the underlying capability and arguments.
- Logging after dispatch cannot prevent an unauthorized effect.

## Root-cause hypotheses
1. Authorization is bound to tool identity instead of capability identity.
2. Execution adapters own policy independently instead of calling a mandatory central guard.
3. Approval tokens are not scoped to a canonical operation digest, actor, capability, target, expiry, and parent task.
4. Delegated agents can emit approval requests without proving an answerable approval route.
5. Unknown or untrusted metadata is interpreted too optimistically.

## Improvement target
Introduce a host-side Unified Approval Boundary (UAB) that every side-effecting operation must cross regardless of transport. It canonicalizes an operation into capability + target + arguments, computes a risk class, checks deterministic policy, validates or requests a scoped approval token, emits an append-only audit event, and only then dispatches the adapter. Unknown routes fail closed.

## Success metrics
- 100% of registered side-effecting adapters invoke the boundary in contract tests.
- Route-equivalent operations receive the same decision across terminal/MCP/delegated paths.
- 0 unauthorized side effects in bypass regression tests.
- 0 unbounded approval waits; unanswered requests terminate at configured timeout.
- Approval reuse succeeds only for an exact canonical-operation digest within TTL.
- Audit coverage = 100% for allow/deny/request/timeout decisions.

## Sources
- https://github.com/NousResearch/hermes-agent/issues/32877
- https://github.com/openai/codex/issues/31565
- https://github.com/anthropics/claude-code/issues/81362
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
