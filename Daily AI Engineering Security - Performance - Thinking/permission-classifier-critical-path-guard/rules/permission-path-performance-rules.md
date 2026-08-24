# Permission-Path Performance Rules

1. Every tool operation that can enter model-based permission classification **MUST** expose separate timestamps for proposal, classifier start/end, approval wait, dispatch, and tool result when those phases exist.
2. Performance claims **MUST** use a baseline captured before optimization.
3. Tool execution latency **MUST NOT** include pre-dispatch classifier or approval time without also reporting those components separately.
4. A classifier latency budget **MUST** be configured and measured at p50/p95/p99; the default investigation threshold is 30 seconds unless the host documents another contractual budget.
5. A classifier budget violation **MUST NOT** cause automatic unsafe execution.
6. When classification is unavailable or exceeds budget, the safe fallback **MUST** be explicit manual approval, task suspension, or a documented deterministic allow/deny rule already authorized by policy.
7. Safety classification, sandboxing, or approval **MUST NOT** be disabled merely to improve latency.
8. Identical classifier failures for the same logical action **MUST** use bounded retries. Default maximum: two automated retries.
9. Retry attempts **MUST** use bounded backoff and **MUST** stop when the failure is deterministic (for example malformed request/schema/policy input).
10. A completed classifier request followed by a dispatch gap beyond the configured budget **MUST** be classified separately from classifier-model latency.
11. Visible “model unavailable” errors **MUST NOT** be assumed to be provider capacity failures without request/transport evidence.
12. Changes are **MUST NOT** be declared improved unless end-to-end task success is maintained and classifier/permission security behavior is unchanged or stronger.
13. Regression verification **MUST** compare the same workload or a documented equivalent distribution.
14. Raw traces **SHOULD** avoid secrets and command payloads unless required; hash or redact action identifiers where possible.