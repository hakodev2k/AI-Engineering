# Skill: Measure Host Contention

## Purpose
Turn “the agent makes my machine lag” into reproducible host-level evidence without assuming model, network, or application causality.

## Trigger
Input/UI lag, high disk activity, CPU pressure, degraded responsiveness after long idle, or a client-version regression.

## Inputs
Sampled CSV, client/version metadata, workload description, threshold config.

## Preconditions
Use a fixed reproducible workload. Preserve security controls.

## Required context
Each sample must identify `idle` or `active` agent state.

## Allowed tools
Read-only OS telemetry, vendor diagnostics, and `../scripts/profile_contention.py`.

## Constraints
MUST separate correlation from causal claims. MUST retain raw trace. SHOULD capture idle and active phases.

## Procedure
1. Record version, OS, hardware, repository/workload characteristics.
2. Capture a 2–5 minute idle baseline.
3. Run a fixed workload and mark samples active.
4. Capture input latency, process CPU, read/write throughput, RSS, and event-loop lag when available.
5. Run the profiler with explicit thresholds.
6. Compare p95/p99, not means alone.
7. Rank at most three hypotheses.
8. Change one suspected factor, repeat the same workload, measure again.
9. Require independent verification before claiming improvement.

## Decision points
No breach: stop. Input latency without resource correlation: investigate UI scheduling/telemetry gaps. Resource correlation: isolate that factor in a controlled rerun.

## Expected output
Raw trace, profiler JSON, hypothesis, before/after comparison, verification status.

## Metrics
p95/p99 input latency; p95 CPU/read/write/RSS/event-loop lag; active/idle latency ratio.

## Verification
A fix is verified only if the same workload improves across at least three runs with no security or functionality regression.

## Failure handling
If tracing perturbs performance, reduce sampling frequency and record it. If restart removes reproduction, record restart as evidence, not root-cause remediation.

## Stop conditions
Maximum three hypothesis cycles, then escalate with preserved traces.
