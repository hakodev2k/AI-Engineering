# Research

## Topic
End-to-end delivery integrity for user-facing assistant text in tool-heavy turns.

## Category
Thinking

## Problem
Agent runtimes can silently lose assistant text between model emission, UI rendering, and transcript persistence. This corrupts the observable evidence available to users, reviewers, resumed sessions, and audit tooling.

## Why it matters now
Recent August 2026 issues show the failure is active across multiple agent products and is not confined to one rendering bug. Some reports lose content only from UI; others lose it from durable JSONL even though the model later demonstrates that the text existed in live context.

## Affected users
Developers supervising coding agents, production operators, teams relying on transcript audits, long-running agent users, and platform builders implementing streaming/resume/export paths.

## Current public evidence

### Observed evidence
1. Anthropic Claude Code issue #86565, opened 2026-08-14, reports at least six assistant text segments in a long multi-tool production-deploy turn missing from both UI and session JSONL while later model context still contained them: https://github.com/anthropics/claude-code/issues/86565
2. Claude Code issue #84153, opened 2026-08-05, reports the response shape `text -> thinking -> tool_use` dropping the text entirely from persisted JSONL: https://github.com/anthropics/claude-code/issues/84153
3. Claude Code issue #85443, opened 2026-08-09/updated in August 2026 evidence, documents thousands of missing streamed text blocks across two machines and multiple versions using a repeatable transcript signature: https://github.com/anthropics/claude-code/issues/85443
4. Hermes Agent issue #54905, opened 2026-06-29, reports intermediate assistant text correctly stored in `state.db` but discarded by the desktop UI after a multi-tool turn completes: https://github.com/NousResearch/hermes-agent/issues/54905
5. Hermes Agent issue #61520, opened 2026-07-09, identifies an unflushed streaming tail that can be lost at `message.complete`: https://github.com/NousResearch/hermes-agent/issues/61520

### Interpretation
These signals indicate at least three independent integrity boundaries: model-stream-to-runtime capture, runtime-to-durable transcript, and durable/stream state-to-presentation reconciliation. Valid tool execution or a successful final response does not prove delivery integrity.

## Existing approaches
- Persist final assistant messages and tool events.
- Reconstruct UI from streaming buffers plus completion events.
- Validate tool-call/result pairing.
- Resume sessions from stored transcript/database records.
- Manually inspect logs when users notice missing content.

## Remaining limitations
- Final-message persistence ignores intermediate user-facing text.
- A UI may look correct live and become incorrect after completion/re-hydration.
- A durable transcript may omit text even when the model received it in its live context.
- Tool-call integrity checks do not cover prose delivery.
- Without stable event identity, comparing stream, storage, export, and UI is heuristic.

## Root-cause analysis
1. Streaming content is split across text, thinking, tool-use, and completion event shapes.
2. Buffers are flushed on lifecycle transitions that differ by client.
3. Persistence and presentation often use different reconstruction logic.
4. Completion status measures agent execution, not communication delivery.
5. There is no universal invariant requiring every emitted user-facing segment to appear durably before success.

## Improvement opportunity
Create a stable event ledger at the first trusted runtime boundary and reconcile it against persisted records before terminal success. Bind user-facing content to `event_id` plus hash; separately record presentation acknowledgement where available. This makes silent omission measurable and blocks false completion without exposing hidden reasoning.

## Goal
Zero silently missing required user-facing assistant segments at terminal completion.

## Metrics
Delivery integrity rate, missing segments/1k, hash mismatches, boundary-specific loss count, verification latency, regression rate.

## Trigger
Every tool-heavy turn, transcript flush, session resume/export, or client re-hydration.

## Inputs
Emission JSONL, persisted transcript JSONL, optional UI acknowledgement stream.

## Outputs
Deterministic pass/fail, missing IDs, mismatched IDs, counts, and evidence for escalation.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/86565
- https://github.com/anthropics/claude-code/issues/84153
- https://github.com/anthropics/claude-code/issues/85443
- https://github.com/NousResearch/hermes-agent/issues/54905
- https://github.com/NousResearch/hermes-agent/issues/61520
