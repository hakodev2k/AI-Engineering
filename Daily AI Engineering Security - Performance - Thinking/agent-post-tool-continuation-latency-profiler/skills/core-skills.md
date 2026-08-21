# Core Skills

## Skill 1 — Capture a Phase-Level Latency Baseline

**Purpose:** separate actual tool runtime from orchestration latency before optimization.

**Trigger:** users report “tools are slow,” agent turns stall, or a runtime upgrade may affect latency.

**Inputs:** representative workload, normalized phase events, environment metadata, latency policy.

**Preconditions:** clocks are monotonic enough for ordering; the benchmark workload is non-destructive; security controls remain enabled.

**Required context:** runtime version, OS, model, tool name, session size/context state, MCP servers, benchmark revision.

**Tools:** trace exporter or host timestamps; `scripts/trace_latency_profiler.py`.

**Procedure:**
1. Choose at least five representative tool cycles and freeze benchmark inputs.
2. Record `tool_start`, `tool_end`, `result_ingested`, `next_model_start`, `next_agent_action` for the same `cycle_id`.
3. Capture environment metadata separately; never put secrets/tool output into timing events.
4. Run the profiler and reject incomplete/non-monotonic cycles.
5. Record p50/p95/p99 for tool runtime, ingestion, continuation, model continuation, and whole tool cycle.
6. Compare continuation/tool ratios and identify which measured phase dominates.
7. Store the result as the baseline for later comparisons.

**Decisions:** if tool runtime dominates, investigate tool/server/filesystem; if result ingestion dominates, inspect serialization/IPC/state persistence; if continuation gap dominates, inspect broker/context/model re-entry; if model continuation dominates, investigate provider/model/context behavior.

**Constraints:** do not infer root cause from one sample; do not disable sandbox/security controls merely to create a faster number.

**Expected output:** baseline summary JSON plus dominant-phase classification.

**Metrics:** sample count, p95 phase latencies, continuation/tool ratio, incomplete-cycle rate.

**Verification:** rerun the same fixture and confirm event ordering and stable order-of-magnitude results.

**Failure handling:** mark missing phases explicitly; repair instrumentation before optimizing.

**Stop conditions:** stop baseline collection after sufficient representative samples exist and no instrumentation errors remain.

## Skill 2 — Diagnose a Slow Tool Cycle

**Purpose:** localize a latency complaint to an observable layer.

**Trigger:** a cycle exceeds `slow_cycle_ms` or p95 budget.

**Inputs:** profiler output and matching trace/run metadata.

**Preconditions:** the cycle has all required phases.

**Required context:** tool type, environment, context size state, whether compaction/reconnect/retry occurred.

**Tools:** profiler output, runtime trace viewer, host logs.

**Procedure:**
1. Compare `tool_runtime_ms` to `continuation_gap_ms` and `model_continuation_ms`.
2. Rank phases by wall-time contribution.
3. Form no more than three hypotheses for the dominant phase.
4. Design one discriminating experiment per hypothesis, changing one variable at a time.
5. Capture new traces; compare phase distributions rather than anecdotal total time.
6. Reject hypotheses contradicted by measurements.
7. Escalate with trace IDs/timestamps when the dominant phase is provider/runtime-owned.

**Decisions:** prefer the hypothesis that predicts and explains measured phase changes across controlled runs.

**Constraints:** bounded to three experiment rounds; no destructive benchmarks or security weakening.

**Expected output:** Facts, Hypotheses, Experiment, Result, Dominant phase, Remaining uncertainty.

**Metrics:** hypothesis elimination rate, p95 phase delta, reproduction rate.

**Verification:** independent reviewer confirms timestamps support the classification.

**Failure handling:** if traces cannot distinguish two layers, add a custom boundary span rather than guessing.

**Stop conditions:** cause is localized enough for an owned fix, or evidence is sufficient to escalate to the owning layer.

## Skill 3 — Verify a Latency Fix

**Purpose:** prove an optimization improves the intended phase without regressions.

**Trigger:** a code/config/runtime change claims to reduce agent/tool latency.

**Inputs:** baseline summary, current summary, policy.

**Preconditions:** comparable benchmark and environment; correctness/security tests pass.

**Tools:** profiler, `latency_regression_gate.py`.

**Procedure:**
1. Re-run the exact baseline workload after the change.
2. Generate current summary.
3. Run the regression gate against both absolute budgets and baseline.
4. Confirm the targeted phase improved and no adjacent phase regressed materially.
5. Confirm task correctness and security controls are unchanged.
6. Record Implemented, Measured, Verified separately.

**Decisions:** accept only if measurements improve or meet policy and correctness/security remain intact.

**Constraints:** never accept “feels faster” or a single best run as evidence.

**Expected output:** regression report with pass/fail and before/after metrics.

**Metrics:** p95 deltas, failure rate, throughput if available, tool/model-call count.

**Verification:** an agent/person other than the implementer reviews high-impact performance changes.

**Failure handling:** revert or continue diagnosis within a maximum of two optimization attempts before escalation.

**Stop conditions:** gate passes and independent verification is complete, or retry budget is exhausted.