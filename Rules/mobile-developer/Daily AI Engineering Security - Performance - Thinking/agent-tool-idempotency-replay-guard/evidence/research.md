# Research — Agent Tool Idempotency Replay Guard

## Category
Performance

## Problem
Durable/retriable agent runtimes can re-execute tool calls after timeout, crash, checkpoint replay, parent retry, or duplicate model emission. For side-effecting tools this can create duplicate emails, payments, writes, jobs, API calls, and 2–3x redundant work/cost.

## Why it matters now
Recent LangGraph reports show multiple independent replay/duplication paths in 2026, while official LangGraph documentation explicitly warns that re-execution can occur and recommends idempotency keys or checking for existing results.

## Current public signals
1. LangGraph #7417 (2026-04-05): long tool calls around 180s were reportedly silently re-dispatched from the last checkpoint while originals continued; both completed, producing 2–3x redundant work/cost.
2. LangGraph #8393 (2026-07-20): parent retry could schedule an already-running PUSH child task again; report states duplicate side effects and graph-state corruption can result.
3. LangGraph #8039 (2026-06): under `durability="sync"`, crash recovery could replay or re-execute depending on persistence ordering, with a reproduction showing an external side effect twice.
4. LangChain #38708 (2026-07-07): request for middleware to collapse duplicate parallel tool calls because identical calls can otherwise produce redundant side effects, latency, cost, and noisy state.
5. Official LangGraph Functional API docs state re-execution may happen when a task starts but does not complete and recommend idempotency keys or checking existing results.

## Existing approaches
Framework retry/checkpoint policies; wrapping side effects in tasks; provider-native idempotency keys; application dedup tables; argument hashing; disabling retries for dangerous operations.

## Limitations
Runtime retries and business-operation identity are separate; checkpoint durability cannot make external side effects exactly-once; provider support varies; naive hashes can collide semantically or miss equivalent operations; in-memory dedup dies on crash; disabling retries harms availability; model instructions cannot protect crash/replay paths.

## Root causes
1. No stable logical-operation identity survives retries/replays.
2. External effect and durable completion recording are not atomic.
3. Duplicate detection occurs after provider execution.
4. Dedup state is process/run scoped rather than durable business scoped.
5. Retry policy ignores tool effect/risk.
6. Ambiguous timeout reconciliation is missing.

## Improvement target
Add a deterministic boundary that derives/requires a stable idempotency key, classifies effects, reserves operations in durable storage before execution, reuses completed results, coordinates concurrent duplicates, reconciles ambiguous timeouts before retry, bounds retries, and emits metrics.

## Success metrics
- 0 duplicate external side effects in replay/retry tests.
- 100% side-effecting calls have a stable operation key before execution.
- Concurrent identical calls cause one provider execution.
- Completed duplicates reuse stored result.
- Ambiguous failures reconcile instead of blind retry.
- Retry/reconciliation loops are bounded.
- Provider calls avoided and guard overhead are measurable.

## Sources
- https://github.com/langchain-ai/langgraph/issues/7417
- https://github.com/langchain-ai/langgraph/issues/8393
- https://github.com/langchain-ai/langgraph/issues/8039
- https://github.com/langchain-ai/langchain/issues/38708
- https://docs.langchain.com/oss/python/langgraph/functional-api
- https://docs.langchain.com/oss/python/langgraph/fault-tolerance

## Evidence boundary
**Observed evidence:** cited issues/docs describe duplicate execution, replay semantics, retries, and idempotency guidance.
**Interpretation:** agent platforms need business-operation identity independent of runtime/model attempt IDs.
**Proposed solution:** this package's reservation ledger, effect classification, reconciliation protocol, scripts, rules, and workflows are a reusable design, not an official LangGraph implementation.