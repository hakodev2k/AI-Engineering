# Skill: Cache Churn Investigation

## Purpose
Measure and diagnose avoidable prompt-cache rewrites in long-running agent workflows.

## Trigger
Unexpected token spend, TTFT/latency spikes, falling cache-read tokens, repeated cache creation, or a client/provider caching change.

## Inputs
Call-level timestamps; input tokens; cache-read tokens; cache-write tokens; optional TTL, prefix fingerprint, tool/config fingerprint, TTFT, cost, task outcome.

## Preconditions
A representative workload can be replayed or observed safely.

## Required context
Provider cache semantics and the actual orchestration trace.

## Allowed tools
Usage logs, JSONL traces, provider docs, profiler script, benchmark runner.

## Constraints
Never remove correctness/security-critical context merely to improve cache reuse. Do not infer cost savings without measured counters.

## Procedure
1. Capture one baseline task end to end.
2. Normalize every model call into the trace schema.
3. Compute weighted cache-read ratio, total cache writes, redundant-write tokens, reset count, and inter-call gaps.
4. Correlate resets with TTL expiry, prefix fingerprint change, tool/config change, or unknown cause.
5. Form one bounded hypothesis (for example: TTL mismatch or unstable prefix).
6. Apply one candidate change.
7. Replay the same workload and compare.
8. Reject changes that degrade task success, correctness, or required context.
9. Hand comparison to independent reviewer.

## Decision points
High writes after gaps >= TTL -> test TTL strategy. High writes after fingerprint mutation -> stabilize only nonessential ordering/configuration. Rewrites without visible cause -> improve instrumentation before optimizing.

## Expected output
Baseline/candidate metrics, reset attribution, hypothesis, accepted/rejected decision.

## Metrics
Cache read/write tokens, redundant-write ratio, write amplification, resets/task, inter-call gap, TTFT/cost/latency when available, task success.

## Verification
Same workload and model/provider conditions where practical; independent review of before/after evidence.

## Failure handling
Retry trace capture once if incomplete. Maximum two optimization hypotheses per run.

## Stop conditions
Missing telemetry after retry, quality regression, security/context loss, or no improvement after two hypotheses.