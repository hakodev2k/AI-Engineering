# Dispatch Performance Rules

- A performance claim MUST start from measured baseline traces.
- Each measured tool call MUST record `call_complete_ms`, `safety_ready_ms`, `tool_start_ms`, and `tool_end_ms` on one monotonic clock.
- Dispatch wait MUST be calculated from the later of call completion and safety readiness to tool start.
- Eager dispatch MUST NOT begin before approval, tool-input guardrails, authorization, and argument finalization are complete.
- Tools with explicit sequencing dependencies MUST NOT be eagerly reordered.
- A theoretical overlap estimate MUST NOT be reported as realized latency improvement.
- Before/after comparison SHOULD use the same workload distribution and tool mix.
- Optimization MUST preserve tool results, ordering constraints, security boundaries, and error semantics.
- p50 and p95 MUST be reported when at least 20 samples exist; otherwise individual samples and sample count MUST be shown.
- A regression in semantic correctness or security MUST block completion even if latency improves.
- Optimization attempts MUST be bounded to two implementation cycles before re-diagnosis/escalation.
