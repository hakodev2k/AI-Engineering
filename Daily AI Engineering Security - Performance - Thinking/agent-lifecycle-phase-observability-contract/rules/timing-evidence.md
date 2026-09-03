# Timing Evidence Rules

- Performance claims MUST identify the measured lifecycle phase.
- Tool slowness MUST NOT be inferred from end-to-end turn time alone.
- Every tool timing record MUST correlate `tool_started` and `tool_completed` using the same `tool_call_id`.
- Required lifecycle events MUST carry stable `run_id` and `turn_id` values.
- Approval wait MUST NOT be counted as tool execution time.
- Missing required events MUST produce `insufficient_evidence` or a blocking profiler failure; they MUST NOT be silently imputed.
- Event timestamps MUST be monotonic within a correlated phase.
- Baseline and comparison traces SHOULD use the same event contract and workload.
- An optimization MUST NOT be reported as verified until the relevant before/after phase metric improves within the configured regression thresholds.
- Human approval is required before any remediation that changes production permissions, security boundaries, or destructive behavior.
