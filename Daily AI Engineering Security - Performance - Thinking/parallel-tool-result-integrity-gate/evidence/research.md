# Research

## Topic
Parallel Tool Result Integrity Gate

## Category
Thinking

## Problem
Parallel tool-call orchestration can silently lose or mis-correlate results, causing agents to reason from incomplete observable state, repeat work, loop, or fail after approval/resume boundaries.

## Why it matters now
Multiple independent 2026 reports show the same contract failure across different agent stacks, especially as parallel tool use and human-in-the-loop flows become common.

## Affected users
Agent framework maintainers, AI coding-agent users, workflow builders, platform teams, and developers using tool calling with concurrency or approvals.

## Current public evidence
### Observed evidence
1. Hermes Agent issue #93251, opened 2026-08-23, reports batches of four or more parallel tool calls losing all results as `Result unavailable`, while batches of one to three succeed. The reporter notes prompt guidance does not hard-enforce a batch limit.
2. n8n issue #36883, opened 2026-08-23, reports AI Agent node tool-loop responses with `finish_reason: tool_calls` being silently discarded instead of executing/appending the call, leading to repeated model invocation.
3. Google ADK Python issue #6589, opened 2026-08-04, reports OCI GenAI integration forwarding only the first result from multiple parallel tool calls and silently dropping remaining outputs.
4. OpenAI Agents Python issue #3004, opened 2026-04-22, documents HITL resume dropping an already executed tool output when parallel calls mix approval-gated and non-approval tools because resume-state bookkeeping marks locally created outputs as if already sent.
5. Microsoft Agent Framework issue #6910, opened 2026-07-04, reports AG-UI losing parallel calls when one requires approval because session-stateful approval data is not preserved across stateless HTTP requests.
6. Haystack issue #11392, opened 2026-05-25, reports an exit-condition tool being ignored when it is not the first call in a parallel batch, causing the agent to continue until maximum steps.

### Interpretation
These are implementation-specific bugs, but they share a reusable invariant: an agent must not advance from a tool-call turn until every emitted call has a known, correctly correlated terminal state. Ordering assumptions, prompt-only concurrency guidance, and partial resume bookkeeping are recurring weak points.

### Proposed solution
Enforce a deterministic turn-integrity gate based on stable call IDs, exact one-to-one terminal accounting, explicit batch limits, and safe bounded recovery before another reasoning/model step.

## Existing approaches
Provider/framework parallel-call switches; prompt guidance to limit concurrency; global max-step limits; retry/error counters; per-framework state hydration; approval checkpoints; sequential execution as a workaround.

## Remaining limitations
Prompt guidance is advisory. Global step limits detect waste late. Sequential fallback sacrifices latency. Retry counters do not detect silent state loss. Approval/resume state can span transport and runtime layers with incompatible ownership assumptions.

## Root-cause analysis
- No universal call/result cardinality invariant at the orchestration boundary.
- Results are sometimes associated by position or transient local state rather than stable IDs.
- Pause/resume hydration confuses locally generated, sent, and acknowledged outputs.
- Runtime concurrency limits differ from model capability hints.
- Silent loss is treated as recoverable prose instead of a blocking state-machine error.

## Improvement opportunity
Make structural completeness machine-verifiable before reasoning continues. Add explicit call IDs, terminal statuses, hard batch limits, idempotency-aware recovery, and independent replay tests across normal and approval-resume paths.

## Relevant sources
- https://github.com/NousResearch/hermes-agent/issues/93251
- https://github.com/n8n-io/n8n/issues/36883
- https://github.com/google/adk-python/issues/6589
- https://github.com/openai/openai-agents-python/issues/3004
- https://github.com/microsoft/agent-framework/issues/6910
- https://github.com/deepset-ai/haystack/issues/11392
