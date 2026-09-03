# Failure and Degraded Mode Rules

## Purpose
Define predictable behavior when RAG dependencies, sources, indexes, or models are unavailable, stale, overloaded, or returning low-quality evidence.

## Scope
Applies to retrievers, indexes, source connectors, rerankers, model providers, caches, authorization services, and network dependencies.

## MUST
- Each critical dependency MUST have defined timeout, retry, fallback, and user-visible failure semantics.
- Degraded modes MUST preserve authorization, provenance, and safety boundaries.
- Empty or low-confidence retrieval MUST be distinguishable from infrastructure failure.
- Fallback retrieval or generation MUST declare when evidence quality is reduced.
- Retry policies MUST use bounded attempts and backoff appropriate to dependency behavior.
- Partial failures in multi-retriever systems MUST be observable and MUST NOT silently masquerade as full-quality success.
- Recovery procedures MUST avoid replaying operations in ways that duplicate or corrupt derived index state.

## MUST NOT
- The system MUST NOT answer as fully grounded when retrieval failed or evidence is unavailable.
- Security filters MUST NOT be bypassed to keep the system available.
- Infinite retries, recursive fallback loops, or unbounded fan-out MUST NOT be used.
- Stale fallback data MUST NOT be treated as current when freshness materially affects correctness.

## SHOULD
- Favor explicit partial answers or safe failure over plausible unsupported completion.
- Exercise degraded modes with fault injection before relying on them in production.
- Use circuit breakers or equivalent controls for persistently failing dependencies.

## Exceptions
Exceptions require documented failure scenario, risk, compensating controls, test evidence, and human approval when a degraded path weakens normal correctness or security guarantees.

## Verification
Run dependency fault injection, timeout tests, empty-retrieval tests, stale-index tests, circuit-breaker tests, partial-retriever failures, and review user-visible degraded responses.