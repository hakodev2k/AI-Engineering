# Research Evidence

## Topic
Tool-Call Journal Atomicity Recovery Guard

## Category
Thinking

## Problem
Stateful AI-agent runtimes can persist a tool-call request but lose the matching result when a child runtime restarts, an event consumer lags, or the process exits between tool completion and durable journal attachment. Resume then reconstructs a logically impossible conversation state: the model history contains an outstanding call whose result can never arrive. Agents may hang, repeatedly restart, consume more usage, or make unsupported assumptions about whether the external side effect happened.

## Why it matters now
Several recent Codex reports in August–September 2026 describe the same invariant failure across desktop, CLI/resume, and gateway integration paths: completed or in-flight custom tool calls become orphaned from their outputs and subsequent resumes repeatedly emit `Custom tool call output is missing for call id`. The reports connect this to app-server replacement, dropped events, mid-call shutdown, and rollout projection failures.

## Affected users
Developers using long-running coding agents, desktop/IDE agent users, platform teams persisting tool-call transcripts, gateway maintainers, and anyone allowing agents to execute side-effecting tools across restart/resume boundaries.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #41236, opened 2026-08-28, reports commands completing successfully before app-server termination, while their tool results are not attached to history; resume can reproduce the same missing-output failure.
2. OpenAI Codex issue #40400, opened 2026-08-24, reports repeated Work Mode child-runtime replacement leaving multiple missing tool outputs across tasks and consuming additional usage during retries.
3. OpenAI Codex issue #38234, opened 2026-08-11, reports app-server event-stream lag dropping hundreds of events; afterward the session cannot resume because a custom tool-call result is missing and the process remains stuck until canceled.
4. OpenAI Codex issue #40934, opened 2026-08-26, reports closing during a tool call leaving an orphaned call; manually inserting an explicit lost/aborted output allowed parsing/resume again.
5. OpenClaw issue #84727 documents the same class across a gateway restart: the call is persisted before the matching output, leaving the native Codex transcript invalid after restart.
6. OpenAI Codex issue #40630, opened 2026-08-26, reports clean app-server exits followed by thread-store ordinal/projection failures and missing custom-tool-output errors.

### Interpretation
This is a durable-state and reasoning-integrity problem, not merely an error-message problem. A tool request/result pair is one logical transaction for future reasoning. If persistence exposes the request without a terminal result, the next agent cannot safely infer whether the tool never ran, ran and failed, or ran successfully but lost its response. Retrying a side-effecting action may duplicate real-world changes.

### Proposed solution
Enforce a journal invariant before resume: every persisted tool call must have exactly one matching terminal result or an explicit indeterminate/aborted recovery marker produced by reconciliation. Detect orphan calls deterministically, block autonomous resume, classify side effects as indeterminate, require external-state reconciliation where applicable, and never synthesize success merely to repair transcript shape.

## Existing approaches
- Append-only JSONL/session journals.
- Runtime retry/restart after tool or transport failure.
- Checkpoint/resume of agent state.
- Tool-call IDs used to correlate calls and outputs.
- Manual transcript repair or explicit aborted/lost markers in exceptional cases.

## Remaining limitations
- Append-only storage does not guarantee atomic visibility of a call/result pair.
- A process restart can happen after the external side effect succeeds but before result persistence.
- Event-stream delivery and durable journal persistence can diverge.
- Blindly synthesizing an error result may restore syntax while hiding a completed side effect.
- Automatic retry is unsafe for non-idempotent tools unless external state is reconciled.
- Generic checkpoint recovery may preserve an already-corrupt transcript.

## Root-cause analysis
1. Call intent and result are persisted in separate durability steps.
2. External side-effect completion and local journal commit are not one transaction.
3. Resume validates parseability but may not validate semantic call/result completeness first.
4. Event consumers can drop required state transitions under backpressure.
5. Recovery logic treats missing output as a normal retryable tool failure rather than an indeterminate execution state.
6. Tool semantics (read-only, idempotent, non-idempotent) are not consistently incorporated into recovery decisions.

## Improvement opportunity
Add a deterministic pre-resume journal checker, explicit `indeterminate` recovery planning, tool-side-effect classification, bounded reconciliation attempts, and a policy that separates syntactic repair from factual recovery. Make the implementing runtime persist terminal markers durably before a resumed agent is allowed to reason over the transcript.

## Goal
Ensure resumed agents never reason from an orphaned tool-call state and never convert unknown external side effects into assumed success/failure.

## Metrics
- Orphan tool calls per 1,000 calls.
- Duplicate outputs/calls per journal.
- Percentage of resumes blocked before corrupt state reaches the model.
- Reconciliation success rate.
- Duplicate external side effects after recovery.
- Mean recovery time.
- Unsupported completion claims after interrupted tools.

## Trigger
Use on every session resume/replay, after app-server/gateway restart, after event-drop detection, before retrying a side-effecting tool whose response was lost, or when modifying tool-call persistence.

## Inputs
Persisted JSONL/journal, tool-call IDs, tool side-effect classification, external reconciliation capability, and recovery policy.

## Outputs
Journal integrity report, explicit recovery plan, reconciled terminal status or blocked/escalated state, and verification record.

## Relevant sources
- https://github.com/openai/codex/issues/41236
- https://github.com/openai/codex/issues/40400
- https://github.com/openai/codex/issues/38234
- https://github.com/openai/codex/issues/40934
- https://github.com/openclaw/openclaw/issues/84727
- https://github.com/openai/codex/issues/40630
