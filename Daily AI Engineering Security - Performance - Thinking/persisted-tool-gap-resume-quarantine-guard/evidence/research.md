# Research

## Topic
Persisted tool-result gaps across agent-runtime restart and thread resume

## Category
Thinking

## Problem
Agent reasoning assumes that each persisted tool invocation has a correlated result. Runtime crashes, event loss, or app-server restarts can persist the call but lose the result, leaving a resumed thread structurally incomplete. Continuing from that state can cause repeated failures, unsupported conclusions, duplicate side effects, or wasted usage.

## Why it matters now
Desktop and long-running agent modes increasingly resume persisted sessions automatically after crashes. Tool-heavy workflows may include shell, file, browser, MCP, and external API actions whose outcome matters to later planning.

## Affected users
Coding-agent users, desktop-agent developers, orchestration/platform teams, and systems that persist and resume tool-call transcripts.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #38234, published 2026-08-12, reports dropped app-server events corrupting resumed sessions. After an event-drop burst, resumed runs produced missing tool-output errors; the harness saw a live process but no meaningful output, and recovery required abandoning/rotating the session. https://github.com/openai/codex/issues/38234
2. OpenAI Codex issue #40400, opened 2026-08-24, reports Windows Work Mode app-server restarts during tool calls. After restart/resume, saved tasks reported missing custom-tool outputs and additional usage was consumed while retrying. https://github.com/openai/codex/issues/40400
3. Codex app-server documentation states that turn items such as shell commands and other agent outputs are persisted and used as context for future conversations, and that `thread/resume` reconstructs stored history. https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md

### Interpretation
The failure is not merely transport instability. Once an incomplete call/result pair is persisted, normal resume can repeatedly reintroduce invalid evidence. Recovery must validate the transcript before asking the model to reason over it.

## Existing approaches
- Restart the app-server/client.
- Resume the same thread.
- Retry the failed turn/tool.
- Abandon the thread and start a new one manually.
- Rely on tool-call IDs during normal streaming correlation.

## Remaining limitations
Restart does not repair persisted history. Blind retry can duplicate side effects when the original call may have succeeded externally. Starting fresh loses useful verified state. Normal streaming correlation does not prove post-crash persisted integrity.

## Root-cause analysis
1. Event persistence and external side effects are not one atomic transaction.
2. Resume trusts stored history before checking call/result completeness.
3. `missing` is often conflated with `failed`, although outcome may be unknown.
4. Recovery logic retries execution before reconstructing evidence.
5. No explicit last-verified checkpoint is used as a safe fork boundary.

## Improvement opportunity
Introduce a deterministic pre-resume integrity scan plus a quarantine workflow. Find unmatched call/result IDs before model execution, distinguish read-only and state-changing uncertainty, reconstruct results only from authoritative durable evidence, and otherwise fork from the last verified checkpoint.

## Proposed solution
`tool_gap_guard.py` detects unresolved calls, orphan results, and duplicate call IDs; rules prevent fabricated results and unsafe retries; the recovery workflow bounds evidence collection and requires independent verification.

## Goal
Prevent reasoning over incomplete tool histories and reduce duplicate side effects/retries while preserving as much verified session state as possible.

## Metrics
Tool-gap rate, corrupt resumes blocked, retries avoided, duplicate side effects, failed-resume usage, recovery time, verification coverage, and rework rate.

## Trigger
Before `thread/resume` execution, after app-server/runtime restart, after a crash during tool execution, or when a missing-tool-output error appears.

## Inputs
Persisted event history, tool-call IDs, tool mutability classification, durable external evidence, checkpoint metadata.

## Outputs
Integrity status, anomalies, unresolved call IDs, quarantine decision, and recovery evidence requirements.

## Relevant sources
- https://github.com/openai/codex/issues/38234
- https://github.com/openai/codex/issues/40400
- https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md
