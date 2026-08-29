# Research — Multi-Interrupt Resume Correlation Gate

## Topic
Deterministic correlation of human/tool resume values to concurrent agent interrupts.

## Category
Thinking

## Problem
Agent workflows with parallel or nested interrupts can accept an ambiguous resume payload or misclassify a dictionary-shaped user value as an interrupt-ID map. In either case, a response can be delivered to the wrong pending request, leave sibling interrupts unresolved, or force application code into framework-specific heuristics.

## Why it matters now
Two fresh LangGraph reports in August 2026 show different manifestations of the same contract weakness. On August 9, issue #8579 demonstrated that one parent task containing two child interrupts could incorrectly accept a scalar resume even though multiple interrupt IDs were pending. On August 23, issue #8693 showed that ordinary dictionary values supplied to `Command(resume=...)` could be interpreted as interrupt maps. Both reports state that they reproduce on current stable/main versions at filing time.

## Affected users
- teams building human-in-the-loop approval flows;
- agent platforms with parallel subgraphs or concurrent tool approvals;
- workflow authors persisting/resuming long-running tasks;
- framework maintainers implementing interrupt/replay semantics;
- operators who need auditable evidence that an answer was applied to the intended request.

## Current public evidence
### Observed evidence
1. LangGraph issue #8579, opened 2026-08-09, reports that a scalar resume is accepted when two interrupts are pending inside one subgraph task. The report says internal pending-interrupt counting observes one parent task instead of all child interrupt IDs, so the scalar value can be delivered according to internal execution order rather than explicit correlation.
   - https://github.com/langchain-ai/langgraph/issues/8579
2. LangGraph issue #8693, opened 2026-08-23, reports that an ordinary dictionary resume value can be misclassified as an interrupt-ID map. The reporter states the bug reproduces on the latest stable release and current main at filing time.
   - https://github.com/langchain-ai/langgraph/issues/8693
3. LangGraph's public interrupt documentation says that when multiple interrupts are resumed in one invocation, callers should map each interrupt ID to its resume value so each response is paired with the correct interrupt.
   - https://docs.langchain.com/oss/python/langgraph/interrupts
4. Older issue #6208 documents the underlying difficulty of tracking multiple interrupts per task and notes that safe optimization requires knowing how many resumes are pending per task.
   - https://github.com/langchain-ai/langgraph/issues/6208

### Interpretation
The problem is not merely “use the API correctly.” Applications often receive resume values from UIs, queues, webhooks, or approval services and need a stable application-level contract before translating those values into a framework-specific `Command(resume=...)`. When the same JSON type can mean either “one user's dictionary answer” or “a map keyed by interrupt IDs,” shape inference is an unsafe decision rule. Concurrent interrupts additionally require exact-set correlation, not positional or task-count heuristics.

## Existing approaches
- Use interrupt-ID keyed mappings for multiple pending interrupts.
- Keep one interrupt per node/task to avoid concurrency ambiguity.
- Rely on framework validation to reject ambiguous scalar resumes.
- Serialize pending interrupts and reconstruct the framework command at resume time.

## Remaining limitations
- framework validation can have edge cases in nested/parallel task layouts;
- dictionary-shaped legitimate answers can collide with “mapping” semantics;
- UI/backend contracts often omit an explicit resume mode;
- callers may send incomplete or stale ID sets;
- application logs may record values without proving which pending ID set they were checked against.

## Root-cause analysis
1. **Type overloading:** a JSON object can be either the user's answer or an interrupt map.
2. **Implicit correlation:** scalar resumes rely on assumptions about the number/order of pending interrupts.
3. **Incomplete pending-state validation:** nested runtimes may summarize pending state at task level instead of interrupt-ID level.
4. **Adapter leakage:** application code passes raw transport payloads directly into framework resume APIs.
5. **Weak audit evidence:** no deterministic pre-resume artifact proves that every pending ID was matched exactly once.

## Improvement opportunity
Introduce a framework-neutral resume envelope with an explicit `mode` discriminator:
- `single` for exactly one pending interrupt; its `value` may be any JSON value, including an object;
- `by_id` for multiple pending interrupts; `responses` must have exactly the same key set as the current pending interrupt IDs.

Validate this envelope deterministically before calling the agent framework. Record the pending ID set, decision, and violations. This does not replace framework fixes; it is an application boundary that makes ambiguous payloads fail closed and provides regression evidence.

## Goal
Prevent ambiguous, stale, incomplete, or misclassified resume payloads from entering the framework runtime.

## Metrics
- ambiguous resume attempts blocked;
- percentage of resumes with explicit mode;
- percentage of multi-interrupt resumes with exact ID-set match;
- miscorrelated resume incidents in integration tests;
- rework/replay count caused by resume mismatch;
- verification pass rate across nested/parallel fixtures.

## Trigger
Any transition from interrupted/pending workflow state back to executable state.

## Inputs
- authoritative current pending interrupt records with unique IDs;
- canonical resume envelope;
- optional workflow/thread/checkpoint identity for logging.

## Outputs
- allow/block decision;
- framework adapter value only after validation;
- machine-readable violations;
- verification evidence suitable for audit logs.

## Relevant sources
- https://github.com/langchain-ai/langgraph/issues/8579
- https://github.com/langchain-ai/langgraph/issues/8693
- https://github.com/langchain-ai/langgraph/issues/6208
- https://docs.langchain.com/oss/python/langgraph/interrupts
