# Skill: Profile Model Residency

## Purpose
Measure whether local-agent latency is dominated by model load/reload events and derive an evidence-based residency policy.

## Trigger
Use when an Ollama-backed agent has intermittent high first-token latency, repeated reloads, or suspected keep-alive regressions.

## Inputs
JSONL telemetry containing `timestamp`, `model`, `total_duration_ms`, `load_duration_ms`; optionally `prompt_eval_duration_ms`, `eval_duration_ms`, `vram_mb`, and `runtime_version`.

## Preconditions
Clock ordering MUST be valid. Measurements MUST cover at least 20 requests and SHOULD include idle gaps longer than the configured keep-alive.

## Required context
Current runtime version, model identity, configured keep-alive, concurrency level, and available GPU/RAM.

## Allowed tools
Read-only telemetry collection, `ollama ps`, GPU monitoring, and `scripts/residency_profiler.py`.

## Constraints
Do not change runtime configuration before baseline capture. Do not pin a model indefinitely when memory pressure is unknown.

## Procedure
1. Capture baseline telemetry across representative agent sessions.
2. Run `python scripts/residency_profiler.py baseline.jsonl --out baseline-report.json`.
3. Record cold-start rate, p50/p95 total latency, p50/p95 load duration, load-duration share, and idle-gap percentiles.
4. Form one hypothesis: insufficient keep-alive, unexpected eviction, concurrency/refcount effect, or memory-pressure eviction.
5. Change only one residency variable per experiment.
6. Collect an equivalent post-change trace.
7. Compare metrics using the workflow and regression rules.

## Decision points
If load-duration share is low, stop and investigate another latency source. If cold starts occur before configured expiry, classify as runtime/policy mismatch rather than insufficient keep-alive. If VRAM pressure rises materially, reject the change even when latency improves.

## Expected output
Baseline and candidate JSON reports plus a recommendation: keep current policy, adjust bounded keep-alive, investigate runtime regression, or move workload/runtime.

## Metrics
Cold-start rate; p95 first-response/total latency; p95 load duration; load-duration share; idle-gap p50/p95; peak resident memory.

## Verification
Improvement requires lower cold-start rate or p95 latency with no unacceptable memory regression on the same workload class.

## Failure handling
Invalid telemetry blocks the run. Fewer than 20 requests produces an insufficient-evidence result. Maximum optimization retries: 3.

## Stop conditions
Stop after verification succeeds, after 3 failed hypotheses, or when the bottleneck is shown not to be residency-related.
