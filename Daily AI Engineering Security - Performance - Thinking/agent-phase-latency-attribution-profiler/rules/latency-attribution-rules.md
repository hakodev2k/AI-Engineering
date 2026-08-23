# Latency Attribution Rules

- Every performance claim **MUST** start from a measured baseline.
- Approval wait, queue wait, retry/backoff, model work, tool execution, host overhead, and finalization **SHOULD** be represented as distinct phases when observable.
- Tool execution duration **MUST NOT** include human approval wait when an execution-start timestamp exists.
- A run with overlapping phase intervals **MUST NOT** be used for exclusive-time claims.
- Unattributed time **MUST** be reported rather than silently assigned to a phase.
- Agent narrative or progress text **MUST NOT** be treated as timing evidence without runtime timestamps.
- A “tool is slow” conclusion **MUST** be supported by tool-execution timing, not only request-to-result wall time.
- Before/after comparisons **MUST** use comparable workload, model/runtime settings, security policy, and approval mode.
- Optimizations **MUST NOT** disable required approval, sandbox, retry-for-correctness, or verification gates.
- Improvement **MUST** be measured again after the change.
- Failed instrumentation collection **MAY** retry at most twice before the result is marked inconclusive.
- Teams **SHOULD** track p50 and p95 across repeated runs rather than rely on one sample.