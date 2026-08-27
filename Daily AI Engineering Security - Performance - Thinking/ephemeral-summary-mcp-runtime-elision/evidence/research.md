# Research — Ephemeral Summary MCP Runtime Elision
**Topic:** Tool-free ephemeral generations inherit and retain MCP runtimes.  
**Category:** Performance  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Internal one-shot generations such as summaries can be implemented as generic ephemeral threads. If those threads inherit the user's global MCP configuration, they can start complete tool-runtime stacks despite never using tools. If completion only unsubscribes the client instead of removing/shutting down the thread, resources remain resident.

## Why it matters now
A fresh Codex Desktop report identifies `thread_summary` as a concrete internal trigger on current alpha builds, while several independent current reports show the broader MCP/session lifecycle still causes large process and memory multiplication across Windows, macOS and Linux.

## Affected users
Agent-host/platform builders, desktop agent users with global stdio MCP servers, teams using internal summary/title generations, and operators of long-running multi-agent sessions.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #39783 reports Desktop 26.814.41407 / CLI 0.148.0-alpha.15 creating an ephemeral thread for each `thread_summary`. The helper disables visible tool surfaces but does not clear `mcp_servers`; completion calls `thread/unsubscribe`, which removes the connection subscription but does not remove the thread or wait for session shutdown. The reporter measured growth from 9 descendants/~236 MiB after restart to 449 MCP-related processes/~10.97 GiB after summary activity, with 116 successful `thread_summary` generations in roughly 31 minutes. https://github.com/openai/codex/issues/39783
2. OpenAI Codex issue #38754 reports current Windows Desktop repeatedly starting another complete local stdio MCP set for successive tool environments inside one task; six turns produced six retained qq_mail_mcp and node_repl instances, with additional CUA overlay processes causing severe cursor stutter. https://github.com/openai/codex/issues/38754
3. OpenAI Codex issue #38825 reports Windows 0.148.0-alpha.9 growing from roughly 7 Node processes at fresh start to 284 after one task; an idle interval did not reproduce growth, while active task execution created 218 Node processes in about five minutes. https://github.com/openai/codex/issues/38825
4. OpenAI Codex issue #38247 reports completed v2 subagents retaining full stdio MCP runtimes because terminal-idle runtime release is not proactive; this independently supports the ownership/lifecycle weakness. https://github.com/openai/codex/issues/38247
5. OpenAI Codex issue #20883 proposes project-scoped shared MCP pooling because per-session startup duplicates server processes. https://github.com/openai/codex/issues/20883

### Interpretation
The specific `thread_summary` defect is an intent/ownership mismatch: a generic session constructor decides resource allocation from inherited configuration rather than from the one-shot task's declared capabilities. Separately, connection subscription lifetime is confused with owned runtime lifetime.

## Existing approaches
- Lazy/on-demand MCP startup.
- Session/thread shutdown paths that terminate MCP runtimes.
- Project-scoped/shared MCP pools.
- User workarounds: restart the app or disable heavyweight global MCP servers.
- Completion via unsubscribe to stop delivering events to a connection.

## Remaining limitations
- Lazy startup cannot help if an internal session is constructed with inherited MCP resources before capability need is known.
- A shared pool still allocates unnecessary tool resources to tool-free internal tasks unless admission expresses resource intent.
- `thread/unsubscribe` is intentionally not equivalent to thread removal/session shutdown.
- Restart/disable workarounds sacrifice uptime or tool availability rather than fixing ownership.
- Generic cleanup after pressure is too late when high-frequency summaries can multiply runtimes rapidly.

## Root-cause analysis
1. Session configuration inheritance is broader than task capability requirements.
2. Resource ownership is bound to generic thread/session creation instead of declared tool intent.
3. Subscription lifetime and runtime lifetime have separate semantics but are used interchangeably at one-shot completion.
4. No deterministic admission invariant asserts `tools_required=false => effective_mcp_count=0`.
5. No completion invariant asserts one-shot ephemeral ownership reaches remove/shutdown with no pending tool calls.

## Improvement opportunity
Introduce an explicit resource-intent envelope before ephemeral session creation and validate completion ownership. Tool-free one-shot features receive zero effective MCP servers. Tool-enabled ephemeral tasks may allocate MCP only when needed. Completion must use an ownership-ending remove/shutdown path after pending tool calls reach zero. Measure process count, RSS, latency and output quality before and after.

## Relevant sources
- https://github.com/openai/codex/issues/39783
- https://github.com/openai/codex/issues/38754
- https://github.com/openai/codex/issues/38825
- https://github.com/openai/codex/issues/38247
- https://github.com/openai/codex/issues/20883
