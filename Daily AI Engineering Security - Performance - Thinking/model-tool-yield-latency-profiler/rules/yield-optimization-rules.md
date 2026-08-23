# Rules: Tool-Yield Optimization

1. Every optimization **MUST** begin with a measured baseline.
2. The system **MUST** track tool yields separately from raw tool-call count.
3. A performance claim **MUST** include before/after wall-clock and p95 yield metrics on equivalent work.
4. Calls **MUST NOT** be parallelized when one consumes another's result, mutates shared state without isolation, depends on ordered approval, or has coupled failure/cancellation semantics.
5. Independent read-only calls **SHOULD** be considered for bounded batching when evidence shows serial yield overhead.
6. Deterministic tool-heavy chains that do not need fresh model judgment **SHOULD** be considered for programmatic execution when supported by the host/model.
7. Parallel fan-out **MUST** have an explicit concurrency bound.
8. Optimization **MUST NOT** bypass authorization, human approval, sandbox, idempotency, logging, or verification controls.
9. Trace parse errors **MUST** prevent a verified-performance claim.
10. If two bounded strategy revisions fail to improve the target metric safely, the workflow **MUST** stop and preserve baseline behavior.