# Skill — Rate-Limit Baseline Analysis

## Purpose
Measure where parallel child-agent traffic saturates a provider/model bucket before changing concurrency or retry behavior.

## Trigger
Use before increasing subagent fan-out, after repeated HTTP 429 responses, or when parallel execution is slower than expected.

## Inputs
A JSONL trace of child requests; workload identity; current orchestration policy; required model capabilities.

## Preconditions
- Trace timestamps use a consistent clock.
- Each request can be associated with a child and model bucket.
- Baseline workload is representative and reproducible.

## Required context
Expected child count, success criteria, provider/model selection rules, maximum acceptable latency and failure rate.

## Allowed tools
Read-only trace inspection, `scripts/analyze_rate_limits.py`, benchmark harnesses, provider documentation.

## Constraints
- MUST NOT increase concurrency before a baseline exists.
- MUST NOT treat provider throttling as a model-quality failure.
- MUST NOT switch models unless compatibility is explicitly established.
- MUST redact credentials and request content from performance traces.

## Procedure
1. Normalize every event to `timestamp`, `child_id`, `provider`, `model`, `attempt`, `status_code`, `latency_ms`, and optional `retry_after_ms`.
2. Group by `(provider, model)`; split by credential/tenant when shared quotas are known.
3. Calculate peak in-flight requests, 429 count/rate, successful completion count, retry amplification, and latency distribution.
4. Identify the first concurrency level/window where 429 density rises or useful completions stop increasing.
5. Check whether failures are concentrated in one model bucket while other buckets remain healthy.
6. Record a hypothesis: capacity saturation, synchronized retries, credit exhaustion, upstream outage, or unknown.
7. Propose a bounded experiment changing one variable: concurrency cap, retry timing, or approved fallback.
8. Run the same workload and compare.

## Decision points
- If 429s occur with low concurrency, inspect account/provider limits before tuning fan-out.
- If `Retry-After` is present, it MUST override shorter local retry delays.
- If fallback changes required capability, reject fallback and queue instead.
- If throughput rises while p95 latency and retries both worsen materially, do not call the change an improvement without explicit trade-off approval.

## Expected output
A baseline table by model bucket, root-cause hypothesis, proposed experiment, and acceptance thresholds.

## Metrics
429 rate, retries/success, p50/p95 latency, useful completions/request, peak in-flight per bucket.

## Verification
Re-run the analyzer against the same workload after the policy change and compare with baseline.

## Failure handling
Invalid or incomplete events are counted and reported. If more than 5% of request outcomes cannot be classified, stop optimization and repair telemetry first.

## Stop conditions
Stop after two policy experiments without improvement, when provider limits are externally fixed and already respected, or when the next change would violate model capability requirements.
