# Skill: Cache Prefix Analysis
## Purpose
Find structural prompt drift that causes avoidable cache misses and token/latency waste.
## Trigger
Cache-read ratio regression, provider migration, prompt-builder change, new memory/plugin/tool source.
## Inputs
At least two comparable redacted request samples, ordered blocks, usage tokens, optional TTFT.
## Preconditions
Provider cache semantics are known; quality baseline exists.
## Required context
Block labels, stable/dynamic intent, provider usage fields.
## Allowed tools
Profiler script, read-only request traces, provider docs.
## Constraints
MUST NOT remove correctness-critical context solely to save tokens. MUST NOT log secrets. MUST distinguish missing telemetry from zero cache reads.
## Procedure
1. Capture a clean baseline with repeated semantically equivalent requests.
2. Record tokens/task, cache reads/writes and TTFT.
3. Run `prefix_drift_profiler.py`.
4. Identify the earliest unstable block and why it changes.
5. Classify the drift as required dynamic context or avoidable metadata/order noise.
6. Move only avoidable dynamic blocks after the reusable boundary or normalize deterministic ordering.
7. Re-measure.
8. Repeat at most twice.
9. Verify answer quality and context completeness.
## Decision points
Missing usage => telemetry gap, not a miss. Early drift in required context => keep context and seek a different cache boundary. Avoidable early drift => normalize/reorder.
## Expected output
Before/after structure and cache metrics with a bounded recommendation.
## Metrics
Cache read ratio, tokens/task, cost/task, TTFT, stable-prefix bytes, quality regression.
## Verification
Independent benchmark confirms equal-or-better quality.
## Failure handling
Stop after 2 unsuccessful changes and preserve the correctness baseline.
## Stop conditions
Any critical-context loss or quality regression blocks completion.
