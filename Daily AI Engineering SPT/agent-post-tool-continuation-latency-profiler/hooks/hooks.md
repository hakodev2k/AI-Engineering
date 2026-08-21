# Hooks

## Hook — Pre-Benchmark Validation
**Trigger:** before any performance benchmark.

**Action:** verify workload revision, environment metadata, minimum sample target, and that sandbox/security controls match the baseline.

**Command/script:** host-specific preflight plus policy read.

**Expected result:** benchmark context is comparable and safe.

**Failure behavior:** abort measurement and report mismatch; never auto-disable controls.

## Hook — Tool Start/End Capture
**Trigger:** immediately before dispatch and immediately after tool handler completion.

**Action:** emit normalized events with `run_id`, `cycle_id`, `tool`, `phase`, `ts`.

**Command/script:** runtime instrumentation/custom span exporter.

**Expected result:** `tool_start` and `tool_end` exist for every measured cycle.

**Failure behavior:** mark cycle incomplete.

## Hook — Result Ingested
**Trigger:** when the agent runtime has accepted/deserialized the tool result into its state/context boundary.

**Action:** emit `result_ingested` for the same cycle.

**Expected result:** ingestion cost becomes independently measurable.

**Failure behavior:** do not infer this timestamp from `tool_end`; add instrumentation.

## Hook — Next Model Start
**Trigger:** when the next model request/generation begins after the tool result.

**Action:** emit `next_model_start`.

**Expected result:** `tool_end → next_model_start` is measurable as continuation gap.

**Failure behavior:** cycle cannot be used for continuation regression gating.

## Hook — Next Agent Action
**Trigger:** first useful post-tool response item/action after model re-entry.

**Action:** emit `next_agent_action`.

**Expected result:** model continuation and total cycle are measurable.

**Failure behavior:** mark cycle incomplete or stalled; preserve evidence.

## Hook — Post-Benchmark Profile
**Trigger:** benchmark run completes.

**Action:** run:
`python scripts/trace_latency_profiler.py events.jsonl --output current-summary.json`

**Expected result:** exit 0 and complete phase metrics.

**Failure behavior:** exit 2/3 blocks performance claims until instrumentation/input is fixed.

## Hook — Regression Gate
**Trigger:** current summary is available.

**Action:** run:
`python scripts/latency_regression_gate.py --current current-summary.json --baseline baseline-summary.json --policy config/latency-policy.json --output regression-report.json`

**Expected result:** exit 0.

**Failure behavior:** reject the optimization/regression candidate; do not adjust thresholds automatically.

## Hook — Final Verification
**Trigger:** before declaring the performance change complete.

**Action:** confirm profiler/gate passed, project correctness tests passed, and security configuration equals baseline.

**Expected result:** Implemented + Measured + Verified.

**Failure behavior:** return incomplete/blocked with named failing metric or verification step.