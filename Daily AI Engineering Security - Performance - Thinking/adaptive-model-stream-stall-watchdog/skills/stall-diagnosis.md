# Skill — Model-Stream Stall Diagnosis
## Purpose
Determine whether agent latency comes from healthy long TTFT, a dead/silent stream, mid-stream starvation, tool execution, or human wait, then derive a bounded watchdog recommendation from evidence.
## Trigger
Repeated timeouts, indefinite model waits, background-agent stalls, or a proposed timeout change.
## Inputs
Timestamped request traces; model/provider/effort bucket; current timeout policy; retry/token-cost data.
## Preconditions
Clock timestamps MUST be monotonic per request. Human/tool waits MUST be labeled separately from model-stream waits.
## Required context
At least 20 healthy samples per bucket is preferred; otherwise retain conservative defaults and mark the result low-confidence.
## Allowed tools
Trace readers, `scripts/analyze_stalls.py`, log query tools, statistics utilities.
## Constraints
Never infer liveness from elapsed time alone when a progress signal exists. Never count human wait as model stall. Never expand ceilings without a bounded upper limit.
## Procedure
1. Separate TTFT from mid-stream gaps and non-model waits.
2. Bucket by provider/model/effort/context regime when those variables materially change latency.
3. Capture baseline timeout rate, completion rate, p95/p99 TTFT and p95/p99 inter-event gaps.
4. Run the analyzer and inspect timeouts marked inside the healthy tail.
5. Form one hypothesis: false-positive timeout, missing timeout, provider incident, or unrelated orchestration stall.
6. Change one policy dimension at a time.
7. Re-measure on the same workload class.
## Decision points
If healthy sample count is below policy minimum, do not auto-tune. If timeout is inside healthy p99, treat it as a false-positive candidate. If the connection has no progress beyond the bounded recommendation, classify it as a stall candidate.
## Expected output
Baseline, diagnosis, proposed phase-specific budgets, retry budget, and verification evidence.
## Metrics
False timeout rate, completion rate, stall duration, retry overhead, p99 latency.
## Verification
Improvement requires fewer false kills or shorter silent stalls without lower completion rate or unbounded waits.
## Failure handling
Rollback to the last verified policy; preserve traces; escalate provider-wide correlated stalls.
## Stop conditions
Maximum two policy experiments per incident; stop earlier when regression appears or evidence is insufficient.
