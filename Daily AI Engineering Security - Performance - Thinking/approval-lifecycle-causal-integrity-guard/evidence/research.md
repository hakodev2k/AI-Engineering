# Research — Approval Lifecycle Causal Integrity Guard

## Topic
Approval lifecycle semantic integrity for tool-using agents.

## Category
Thinking

## Problem
Human approval pauses are frequently represented through the same tool/result channels used for execution and errors. If an agent cannot distinguish `awaiting_approval`, `approved`, `executing`, `rejected`, `interrupted`, and `completed`, it can form false causal conclusions, report invented performance diagnoses, retry or continue incorrectly, or execute a call whose rejection was not represented correctly.

## Why it matters now
Human-in-the-loop controls are becoming a core production safety mechanism for coding and business agents. Recent 2026 bug reports show that approval lifecycle state can be semantically corrupted even when the UI appears to work.

## Affected users
Agent-runtime developers, coding-agent users, platform teams integrating HITL, observability teams, and reviewers who rely on approval gates for high-impact actions.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #38731, opened 2026-08-15, reports that approval-wait wall time can be attributed to tool execution. The agent then invents a technical cause for the apparent delay and changes its implementation decision. The reporter separately measured about 11 seconds of actual tool execution versus minutes of approval wait. https://github.com/openai/codex/issues/38731
2. LangGraph issue #8218, opened 2026-06-29, reports that `interrupt()` raised inside a tool can be emitted as `tool-error`, losing the structured interrupt semantics. A pause is therefore misclassified as failure. https://github.com/langchain-ai/langgraph/issues/8218
3. LangGraph issue #8394 documents wrapper paths that can swallow `GraphBubbleUp` interrupts and continue as if the tool failed. https://github.com/langchain-ai/langgraph/issues/8394
4. LangChain issue #37093 reports a failure mode where a rejected tool call remained in an `AIMessage` and could still be executed by `ToolNode`. https://github.com/langchain-ai/langchain/issues/37093
5. LangGraph documentation explicitly describes HITL as a durable pause that may last minutes, hours, or days before resume, confirming that approval wait is intentionally distinct from tool execution. https://github.com/langchain-ai/langgraphjs/blob/main/docs/docs/agents/human-in-the-loop.md

### Interpretation
These are different products and failure modes but share one root defect: lifecycle states are not consistently encoded as first-class, causally meaningful telemetry. Generic tool-error/status/wall-clock fields are insufficient for reliable reasoning and verification.

## Existing approaches
- Framework-specific interrupt/pause primitives and checkpoints.
- Human approval middleware and per-tool approval prompts.
- End-to-end tool elapsed time in traces.
- Error handling wrappers and retry policies.
- Manual inspection when an agent reports anomalous latency or approval behavior.

## Remaining limitations
- End-to-end wall time often includes human wait and cannot support execution-performance conclusions.
- An interrupt may cross wrapper/tool boundaries as an exception and be flattened into an error.
- Rejection state may not remove or invalidate the pending executable call.
- Agent-facing telemetry may omit state transitions, causing unsupported causal explanations.
- Existing traces rarely enforce a state-machine invariant before an agent uses them for diagnosis.

## Root-cause analysis
1. Pause/approval is modeled as exceptional control flow rather than a durable lifecycle state.
2. Tool spans collapse queue, approval, execution, and post-processing into one duration.
3. State transitions are distributed across UI, orchestrator, middleware, and tool runner.
4. Retry/error middleware catches broad exceptions without preserving interrupt semantics.
5. Rejection is treated as message content instead of revocation of executable intent.
6. Agent reasoning consumes ambiguous telemetry without an evidence gate.

## Improvement opportunity
Normalize every approval-gated invocation into an explicit state machine with monotonic timestamps and immutable call IDs. Derive `approval_wait_ms`, `execution_ms`, and `postprocess_ms` separately. Block performance conclusions when execution-only timing is absent. Treat rejection as terminal for that call ID unless a new call is created. Validate traces deterministically before they become evidence for agent reasoning.

## Proposed solution
A reusable trace auditor, state semantics rules, diagnostic skill, independent causal reviewer, blocking pre-diagnosis hook, and bounded remediation workflow. The package does not replace framework approval controls; it verifies the semantic contract around them.

## Goal
Prevent approval/HITL lifecycle ambiguity from becoming false technical conclusions or unsafe continuation.

## Metrics
- `invalid_transition_count`
- `approval_time_misattribution_count`
- `rejected_then_executed_count`
- `interrupt_as_error_count`
- `% performance diagnoses backed by execution_ms`
- mean approval-wait and execution durations reported separately
- unsupported causal conclusion rate in sampled agent traces

## Trigger
Before using tool latency as evidence, after any approval-gated call, after resume/rejection, and during regression tests for HITL middleware.

## Inputs
JSONL lifecycle trace with `call_id`, `state`, `ts_ms`, optional `duration_ms`, `tool`, and `message`.

## Outputs
Machine-readable audit report, blocking exit status, detected invariant violations, and evidence suitable for independent review.

## Verification
Verified only when malicious/invalid fixtures are blocked, valid lifecycle traces pass, execution-only duration is separated from approval wait, rejected calls cannot transition to executing, and no reasoning workflow consumes failed audit output.

## Relevant sources
- https://github.com/openai/codex/issues/38731
- https://github.com/langchain-ai/langgraph/issues/8218
- https://github.com/langchain-ai/langgraph/issues/8394
- https://github.com/langchain-ai/langchain/issues/37093
- https://github.com/langchain-ai/langgraphjs/blob/main/docs/docs/agents/human-in-the-loop.md
