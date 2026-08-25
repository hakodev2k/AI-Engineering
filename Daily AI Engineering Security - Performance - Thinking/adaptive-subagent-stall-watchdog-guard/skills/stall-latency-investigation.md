# Skill — Stall Latency Investigation

## Purpose
Determine whether watchdog aborts represent genuine stalls or false positives caused by model/transport tail latency.

## Trigger
Repeated fixed-duration aborts, unexplained subagent retries, or poor long-task completion rate.

## Inputs
Timestamped subagent events, model/effort/context cohort, transport state, retry records, token usage.

## Preconditions
At least 20 representative gap samples for calibration when possible; otherwise results remain provisional.

## Allowed tools
Read-only transcript/event analysis, CSV export, `calibrate_gaps.py`, `watchdog_decision.py`.

## Procedure
1. Measure baseline: p50/p95/p99 post-tool-to-next-model gap and current kill threshold.
2. Plot/count aborts by exact elapsed gap and cohort.
3. Identify near-miss healthy completions beyond 75% of threshold.
4. Check transport closure/failure signals separately from model silence.
5. Quantify retry amplification: repeated tokens, repeated tool calls, completion loss.
6. Form a hypothesis: true dead stream, provider tail, fixed-threshold false positive, or mixed.
7. Replay decisions offline through the proposed policy.
8. Proceed to implementation only if predicted false-abort reduction does not create unbounded detection latency.

## Expected output
Baseline, evidence, hypothesis, recommended p99/ceiling, predicted trade-off, verification plan.

## Metrics
False aborts, true-stall detection latency, completion rate, retry tokens, p99 gap.

## Failure handling
Insufficient samples => no automatic threshold reduction. Missing transport data => classify ambiguity explicitly.

## Stop conditions
Maximum two policy iterations; escalate if false-abort and detection-latency goals cannot both be met.