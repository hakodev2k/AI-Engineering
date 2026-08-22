# Research — Side Effect Reconciliation Ledger

## Topic
Side Effect Reconciliation Ledger

## Category
Thinking

## Problem
An agent can receive an error, disconnect, missing-handler response, or lost continuation after dispatching a mutating tool even though the external mutation actually committed. Treating the caller-visible error as proof of non-execution and immediately retrying can create duplicate tasks, messages, approvals, records, or other side effects.

## Why it matters now
Current agent systems increasingly orchestrate remote workers and connector mutations across unreliable client/server boundaries. Recent Codex reports show false failures after successful task creation, dynamic-tool response races where a mutation commits but the caller receives an error, and Work-mode turns losing post-tool continuation while an external write remains durable.

## Affected users
- Developers using coding agents with mutating tools.
- Agent-platform builders implementing retries and reconnects.
- Teams automating issue/task/message/document creation.
- Operators of long-running agents where transport and UI continuation can fail independently from the external system.

## Current public evidence
### Observed evidence
1. openai/codex #36592 (2026-08-02): `create_thread` reportedly created usable tasks but returned an error; normal retries created duplicate tasks. Five observed calls across two saved local Git projects were reported.
2. openai/codex #35894 (2026-07-29): a dynamic mutating tool could execute on the handler-owning subscriber while a non-owner error won the response race; caller-visible failure could therefore disagree with durable state and retries could duplicate work.
3. openai/codex #35658 (2026-07-27): a ChatGPT Work turn reportedly lost continuation around a tool call while a Notion write had already committed; subsequent readback found the completed mutation.
4. openai/codex #27757 (2026-06-12): repeated tool-call IDs/results across retry requests demonstrate a separate retry-state failure mode where stale tool state can be resubmitted.

### Interpretation
The recurring engineering gap is not simply “retry bugs.” Mutations need a three-state model: **confirmed-not-applied**, **confirmed-applied**, and **unknown-after-dispatch**. A transport/tool error after dispatch belongs to the third state until durable readback or an idempotency contract resolves it.

### Proposed solution
Maintain a small external operation ledger keyed by a stable idempotency key. Before dispatch record intent; after dispatch mark the operation `unknown` until positive confirmation. On ambiguous failure, run a reconciliation/readback step before any retry. Retry only when the system can prove non-application or when the downstream API provides a safe idempotency guarantee.

## Existing approaches
- Blind retry on exceptions/timeouts.
- Exponential backoff.
- Tool-call IDs scoped to a request/turn.
- Application-level uniqueness constraints.
- Manual readback after suspicious failures.
- API idempotency keys where supported.

## Remaining limitations
- Backoff changes timing but not duplicate semantics.
- A request-scoped tool ID may not survive reconnect/resume or map to durable downstream state.
- Not every external API exposes idempotency keys.
- A uniqueness constraint can reject duplicates but still leave the agent uncertain whether the first operation succeeded.
- Manual readback is inconsistent and easy to skip in autonomous loops.
- A caller-visible error can originate after the mutation committed.

## Root-cause analysis
1. Agents often collapse “error observed” into “operation not applied.”
2. Transport completion and durable mutation completion are distinct events.
3. Retry policies are frequently generic and unaware of side-effect class.
4. Operation identity is not persisted across turns/reconnects.
5. Readback/reconciliation is not a mandatory state transition.
6. Multi-subscriber/tool routing can produce response arbitration races.

## Improvement opportunity
Make ambiguous side-effect recovery explicit and deterministic: persistent operation identity, state machine, evidence-bearing readback, bounded reconciliation, and retry eligibility computed from evidence rather than intuition.

## Metrics
- duplicate mutation rate;
- percentage of mutating calls with stable operation keys;
- ambiguous failures reconciled before retry;
- retries avoided because the original mutation was found;
- unresolved ambiguous-operation count;
- mean reconciliation latency;
- false “not applied” decisions discovered later.

## Relevant sources
- https://github.com/openai/codex/issues/36592
- https://github.com/openai/codex/issues/35894
- https://github.com/openai/codex/issues/35658
- https://github.com/openai/codex/issues/27757

## Evidence status
**Implemented:** package provides a local deterministic operation ledger and recovery workflow.

**Measured:** adopting systems must collect duplicate/reconciliation metrics on real integrations.

**Verified:** only after tests and integration-specific readback scenarios prove retries are blocked while state is ambiguous.