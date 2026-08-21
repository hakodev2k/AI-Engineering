# Research

## Topic
Agent Lineage Guardrail Enforcement

## Category
Security

## Problem
Security hooks and permission policies can behave differently across parent agents, in-process subagents, and separately spawned agent-team teammates. Current hook payloads may also omit caller identity, making per-actor enforcement and audit correlation impossible.

## Why it matters now
Multi-agent coding is becoming a first-class workflow. A guardrail that protects only the parent process is not a reliable security boundary when delegated agents can execute tools independently.

## Affected users
Developers using subagents/agent teams, enterprise platform teams, CI agents, security-conscious coding-agent users.

## Current public evidence
### Observed evidence
- Anthropic issue #84926 (2026-08-07) reports `PreToolUse` payloads without caller/agent identity, preventing per-actor guardrails.
- Anthropic issue #82418 (2026-07-29) reports `PermissionRequest` hooks not being dispatched for agent-team teammates while working for in-process subagents.
- Anthropic issue #21460 documents a security bypass class where subagent tool calls were not protected by parent `PreToolUse` hooks.
- Anthropic's official permissions documentation describes PreToolUse hooks as a runtime permission-control layer and managed settings as enterprise-enforced policy, which makes cross-agent enforcement consistency a critical expectation.

## Existing approaches
Managed settings, tool allow/deny rules, PreToolUse/PermissionRequest hooks, intercepting Task/Agent creation, and prompt-based delegation constraints.

## Remaining limitations
Spawn-time prompt inspection cannot enforce every later tool call. Missing agent identity prevents deterministic actor-based policy. Separate teammate processes can create policy-propagation gaps. Prose instructions are not a substitute for runtime enforcement.

## Root-cause analysis
1. Policy scope is implicitly process/session-local instead of lineage-wide.
2. Hook events lack stable actor lineage metadata.
3. Child launch does not always carry an immutable policy snapshot/hash.
4. Audit records cannot prove every descendant call passed the same policy gate.

## Improvement opportunity
Add a reusable lineage guard: mint stable actor IDs, bind every child to a parent and immutable policy hash, require hook coverage probes before delegation, deny high-risk tool execution when identity/policy proof is missing, and verify descendant audit coverage independently.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/84926
- https://github.com/anthropics/claude-code/issues/82418
- https://github.com/anthropics/claude-code/issues/21460
- https://docs.anthropic.com/en/docs/claude-code/iam
