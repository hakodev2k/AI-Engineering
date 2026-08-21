# Engineering Rules

## MUST
- MUST establish a phase-level baseline before claiming an optimization.
- MUST record missing phases as incomplete; never substitute zero duration.
- MUST distinguish `tool_runtime`, `result_ingestion`, `continuation_gap`, `model_continuation`, and total tool-cycle latency.
- MUST use comparable workloads for before/after measurements.
- MUST preserve runtime, OS, model, tool, and relevant context-state metadata with benchmark results.
- MUST use p95 or another declared percentile for regression decisions; do not cherry-pick best runs.
- MUST keep optimization retries bounded to two rounds unless a human explicitly extends the experiment.
- MUST preserve correctness, sandboxing, permissions, and security controls while benchmarking.
- MUST report Implemented, Measured, and Verified as separate states.
- MUST escalate with timestamps/trace IDs when the dominant latency lies in an external/provider-owned phase.

## MUST NOT
- MUST NOT call a tool/server slow solely from end-to-end task time.
- MUST NOT blame disk, network, MCP, model, sandbox, or context processing without evidence that isolates that layer.
- MUST NOT remove security checks, approvals, sandboxing, or validation to make benchmark numbers look better.
- MUST NOT run destructive latency probes by default.
- MUST NOT compare workloads with materially different context size or tool behavior without labeling the comparison non-equivalent.
- MUST NOT hide timeouts, retries, failed samples, or incomplete cycles.
- MUST NOT treat a successful underlying command as proof that the full agent tool cycle is performant.
- MUST NOT accept a latency improvement that causes correctness, reliability, or security regression.

## SHOULD
- SHOULD collect at least five cycles per benchmark and more for noisy production paths.
- SHOULD expose custom spans around result ingestion, state persistence, context hydration, and model re-entry when default tracing cannot separate them.
- SHOULD group results by tool, OS/runtime version, model, and context state.
- SHOULD track p50/p95/p99, error rate, timeout rate, tool/model-call count, and throughput where relevant.
- SHOULD maintain a small stable benchmark fixture in CI.
- SHOULD use continuation/tool ratio as a diagnostic signal, not as proof of root cause.
- SHOULD independently review high-impact performance fixes.
- SHOULD keep raw tool outputs out of performance telemetry unless explicitly required and safely redacted.