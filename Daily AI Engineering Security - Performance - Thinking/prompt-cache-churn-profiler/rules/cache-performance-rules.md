# Cache Performance Rules

1. Cache optimization **MUST** begin with a measured baseline.
2. Performance claims **MUST** report absolute cache-read and cache-write tokens, not hit percentage alone.
3. Repeated writes of a stable reusable prefix **MUST** be treated as measurable churn and investigated.
4. TTL changes **MUST** be justified by observed inter-call gaps and provider semantics.
5. A longer TTL **MUST NOT** be assumed cheaper without workload-level comparison.
6. Prefix stabilization **MUST NOT** remove security, user, tool, or correctness-critical context.
7. Provider/tool/thinking configuration changes that invalidate cache **SHOULD** be fingerprinted when telemetry permits.
8. Baseline and candidate **MUST** use equivalent workload and success criteria.
9. Optimization loops **MUST** be bounded to at most two hypotheses per run.
10. A candidate **MUST NOT** be accepted if task success or verification quality regresses beyond configured tolerance.
11. Unknown cache-reset causes **MUST** be reported as unknown rather than guessed.
12. Cost/latency improvements **MUST** be distinguished as measured or proxy-estimated.