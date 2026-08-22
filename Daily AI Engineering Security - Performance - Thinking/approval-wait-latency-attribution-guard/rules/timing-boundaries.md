# Rules: Timing Boundaries

1. Every approval-gated tool call MUST record approval-required and approval-decision timestamps.
2. Every measured tool call MUST record execution-start and execution-end timestamps.
3. Performance diagnosis MUST use `tool_execution_ms` when evaluating tool implementation latency.
4. Approval wait MUST NOT be included in a claim that the tool, API, database, network, or command itself is slow.
5. Total wall time SHOULD be reported separately for user-experience analysis.
6. A trace MUST be rejected when lifecycle timestamps violate causal ordering beyond configured clock skew.
7. Missing execution boundaries MUST result in `insufficient_evidence`; they MUST NOT be estimated from approval-inclusive elapsed time.
8. Benchmark comparisons MUST use equivalent workloads and the same timing semantics.
9. A performance optimization MUST have a baseline before implementation and a measured after-state.
10. An agent MUST NOT invent a root cause from elapsed time alone.
11. Approval UX improvements MUST NOT weaken approval requirements or bypass required human decisions.
12. The implementing agent MUST NOT be the only verifier of a claimed latency improvement.
