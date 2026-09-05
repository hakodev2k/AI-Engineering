# Research

## Topic
Tool-Call Transcript Atomicity Gate

## Category
Thinking

## Problem
Agent runtimes can persist or replay incomplete tool-call histories, leaving conversations structurally invalid and causing repeated resume failures, lost continuity, incorrect recovery, or duplicate side effects.

## Why it matters now
A fresh open Codex issue from 2026-08-28 reports completed commands whose outputs were not attached before the app-server restarted. The resumed task repeatedly encountered `Custom tool call output is missing for call id`. Similar failures are reported across other agent runtimes and frameworks, indicating a recurring reliability boundary in long-running tool-heavy work.

## Affected users
AI coding-agent users, agent framework maintainers, workflow/orchestration platform builders, developers implementing persistence/resume, and teams running long tool-heavy tasks.

## Current public evidence
### Observed evidence
1. **openai/codex #41236, opened 2026-08-28.** The reporter observed Codex Desktop app-server restarts during tool calls; some commands completed successfully but their results were not attached to history. Two of roughly 337 exec calls were missing outputs, and more than 90 related errors were logged locally. Resuming could reproduce the failure.
2. **NousResearch/hermes-agent #11351, opened 2026-04-17.** Interrupting while tools were pending could persist an assistant message with tool calls but no tool responses, corrupting the next API request. The proposed fix centralized sanitization at persistence time so all exit paths share the invariant.
3. **microsoft/agent-framework #5855, opened 2026-05-14.** Persisted AG-UI history could replay assistant tool calls without matching tool messages, causing OpenAI/Azure validation errors.
4. **openclaw/openclaw #13351, opened 2026-02-10.** Tool results were intermittently lost; the runtime inserted a synthetic error result for transcript repair, causing stalls and retries.
5. **Azure AI Foundry / Fabric Data Agent report, 2026-05-05.** A failed tool execution could omit the required output event, leaving the stateful conversation stuck; a Microsoft moderator described this as aligning with preview limitations in error handling/cross-service execution flow.

### Interpretation
The common failure is a broken durable state-machine invariant: `call` persistence and terminal `result/cancel` persistence are not treated as one recoverable protocol. Error-path-specific cleanup is insufficient because interrupts, crashes, gateway restarts, and replay transformations create different partial states.

### Proposed solution
Use an append-only call journal and a deterministic integrity gate at every durability/resume boundary. Classify unresolved calls explicitly and close them as cancellations only when real results are unavailable. Separate structural repair from side-effect replay decisions, and bound recovery attempts.

## Existing approaches
Message-history validation; provider schema errors; synthetic error insertion; retry/resume; ad hoc transcript sanitizers; session reconstruction; checkpoint persistence.

## Remaining limitations
- A provider validation error detects corruption only after an invalid request is built.
- Synthetic error records can blur whether execution occurred.
- Retrying may duplicate non-idempotent side effects.
- Cleanup logic duplicated across error paths is easy to miss on interrupt/shutdown.
- Message-level persistence does not guarantee call/result atomicity.
- Resume loops can repeatedly load the same invalid native transcript.

## Root-cause analysis
- Tool invocation lifecycle lacks explicit durable states.
- Call and result are written in separate failure windows.
- Shutdown/interruption can bypass normal completion handlers.
- Replay/compaction adapters can drop or reorder structured tool events.
- Recovery conflates structural validity with whether the tool should be re-executed.
- No pre-checkpoint/pre-resume integrity assertion exists.

## Improvement opportunity
Centralize invariants at persistence and resume boundaries; use a deterministic validator; preserve original evidence; produce repaired copies instead of mutating originals; require idempotency/approval before re-execution; and independently verify the recovered task state.

## Relevant sources
- https://github.com/openai/codex/issues/41236
- https://github.com/NousResearch/hermes-agent/issues/11351
- https://github.com/microsoft/agent-framework/issues/5855
- https://github.com/openclaw/openclaw/issues/13351
- https://learn.microsoft.com/en-gb/answers/questions/5881539/azure-ai-foundry-agent-fabric-data-agent-tool-call
- https://github.com/openai/codex/issues/29773
