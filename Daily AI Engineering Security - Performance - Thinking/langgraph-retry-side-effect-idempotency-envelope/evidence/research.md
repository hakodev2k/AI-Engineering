# Research — LangGraph Retry Side-Effect Idempotency Envelope

**Topic:** Retry-safe external side effects in durable agent workflows  
**Category:** Thinking  
**Research date:** 2026-08-28 (UTC+7)

## Problem
Agent runtimes can retry failed nodes, resume interrupted nodes from the beginning, or replay child tasks. External side effects are outside the graph checkpoint unless the application explicitly gives them a stable idempotency boundary. A transient failure can therefore duplicate a payment, email, mutation, or other consequential action.

## Why it matters now
A LangGraph issue opened August 24, 2026 asks for clearer documentation of what retries can repeat and explicitly notes that users may place payments, emails or mutations directly in retryable code and execute them twice. A July 28, 2026 feature proposal describes long-running/retried graph executions re-invoking tools after worker restarts or timeouts and proposes a durable claim store. LangGraph's own current documentation states that resumed nodes can rerun and that side effects should be idempotent.

## Affected users
Developers building durable or long-running LangGraph agents, teams using retries/interrupts/checkpointing, and platform builders wrapping APIs with non-idempotent side effects.

## Current public evidence
### Observed evidence
1. LangGraph issue #8702, opened August 24, 2026, requests explicit retry/idempotency documentation and states that application code can perform payments, email or mutations twice on retry: https://github.com/langchain-ai/langgraph/issues/8702
2. LangGraph issue #8464, opened July 28, 2026, proposes durable tool-execution idempotency because worker restarts/timeouts can re-invoke tools and duplicate side effects: https://github.com/langchain-ai/langgraph/issues/8464
3. LangGraph issue #8393, opened July 2026, reports failed child-task deduplication during parent retry, with potential duplicate side effects and graph-state corruption: https://github.com/langchain-ai/langgraph/issues/8393
4. Official LangGraph Interrupts documentation says a resumed node restarts from the beginning and side effects before `interrupt()` should be idempotent: https://docs.langchain.com/oss/python/langgraph/interrupts
5. Official Functional API documentation says tasks can be re-executed after failure and recommends idempotency keys or verifying existing results: https://docs.langchain.com/oss/python/langgraph/functional-api
6. Official Fault Tolerance documentation describes automatic node retries and bounded retry policies: https://docs.langchain.com/oss/python/langgraph/fault-tolerance

### Interpretation
Checkpoint durability and external exactly-once semantics are separate concerns. A graph may restore its internal state correctly while an external system has already committed a side effect. Reliability therefore requires an application-owned operation identity and transactional claim/result boundary outside model reasoning.

## Existing approaches
- Put side effects inside checkpointed task functions.
- Use idempotent APIs or API-provided idempotency keys.
- Check for existing results before creating new records.
- Configure bounded retry policies and error handlers.
- Separate side-effect nodes from interrupt/reasoning nodes.

## Remaining limitations
- Many external APIs do not provide idempotency keys.
- A pre-check followed by a write is race-prone without an atomic claim.
- A process may crash after the side effect succeeds but before graph state records success.
- Randomly generating a new key on retry defeats idempotency.
- Graph checkpoint identity may not equal business-operation identity.
- Retry defaults cannot infer which application actions are consequential.

## Root-cause analysis
1. External state and graph checkpoint state are separate transactional domains.
2. Operation identity is often derived from execution attempt rather than business intent.
3. Side-effect code is mixed with retryable reasoning/orchestration code.
4. Check-then-act patterns are non-atomic under concurrency.
5. Recovery logic lacks explicit `execute`, `wait`, `reuse`, and `blocked` states.

## Improvement opportunity
Create a deterministic idempotency envelope that hashes stable business intent, atomically claims execution in durable storage, bounds attempts, persists a result record, returns stored results on replay, and fails closed on ambiguous identity. Keep authorization separate and require independent verification for consequential actions.

## Relevant sources
- https://github.com/langchain-ai/langgraph/issues/8702
- https://github.com/langchain-ai/langgraph/issues/8464
- https://github.com/langchain-ai/langgraph/issues/8393
- https://docs.langchain.com/oss/python/langgraph/interrupts
- https://docs.langchain.com/oss/python/langgraph/functional-api
- https://docs.langchain.com/oss/python/langgraph/fault-tolerance
