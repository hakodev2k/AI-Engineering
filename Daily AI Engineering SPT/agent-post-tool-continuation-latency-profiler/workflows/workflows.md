# Workflows

## Workflow 1 — Measure → Diagnose → Optimize → Re-measure

**Trigger:** a tool path is reported slow or exceeds latency policy.

**Goal:** identify and improve the actual dominant phase without degrading correctness/security.

**Inputs:** representative workload, trace source, `config/latency-policy.json`.

**Baseline:** at least the policy minimum number of complete cycles from the unchanged system.

**Context:** runtime/model/OS/tool versions, context size state, MCP/sandbox configuration, workload revision.

### Stages
1. **Instrument** — Trace Collector maps raw trace events to the five required phases.
2. **Baseline** — run profiler; reject incomplete instrumentation.
3. **Classify** — Performance Investigator ranks phase contributions and identifies continuation-dominant cycles.
4. **Hypothesize** — create at most three measurable hypotheses for the dominant layer.
5. **Experiment** — alter one relevant variable; capture comparable traces.
6. **Implement** — only after evidence localizes an owned bottleneck.
7. **Measure again** — reproduce the frozen workload.
8. **Gate** — compare absolute budgets and baseline using `latency_regression_gate.py`.
9. **Independent verify** — confirm correctness/security and metric validity.

**Responsible agents:** Trace Collector → Performance Investigator → Implementation Agent → Verification Agent → Orchestrator.

**Tools:** runtime tracing, profiler, regression gate, project tests.

**Outputs:** baseline summary, diagnosis, current summary, regression report.

**Checkpoints:** after baseline; after hypothesis tests; before implementation; before final acceptance.

**Metrics:** p95 tool runtime, ingestion delay, continuation gap, model continuation, tool-cycle time; error/timeout rate; call count where available.

**Retry policy:** maximum 3 diagnosis experiments; maximum 2 optimization attempts.

**Stop conditions:** stop when gate passes and correctness/security verification passes; or stop and escalate when retry budget is exhausted or bottleneck is external/unobservable.

**Failure path:** preserve failed measurements, restore known-good implementation when appropriate, report dominant phase and evidence; never loosen security or accuracy thresholds.

**Verification:** baseline/current workloads are comparable; timestamps are complete/monotonic; regression gate exits 0; functional/security checks pass.

**Definition of Done:** measured improvement or budget compliance, no material adjacent-phase regression, no blocking instrumentation error, independent verification complete.

## Workflow 2 — Production Slow-Cycle Triage

**Trigger:** production/tool-cycle latency exceeds `slow_cycle_ms`.

**Goal:** determine ownership quickly without speculative fixes.

**Inputs:** one or more slow traces and nearby normal traces.

**Baseline:** recent healthy distribution for the same tool/environment where available.

**Stages:**
1. Validate trace completeness.
2. Compute phase durations.
3. Compare slow vs healthy cycle.
4. Classify likely ownership by dominant measured phase:
   - high tool runtime → tool/service/filesystem;
   - high ingestion → serializer/IPC/state layer;
   - high continuation gap → broker/context/model re-entry scheduling;
   - high model continuation → provider/model/context processing.
5. Attach trace IDs, timestamps, versions, and percentile evidence.
6. Route to owner; do not change runtime behavior during triage unless a safe rollback is already approved.

**Retry policy:** one re-capture attempt if instrumentation is incomplete; otherwise escalate.

**Stop conditions:** ownership is identified with evidence or observability gap is documented.

**Verification:** another reviewer can reconstruct the duration calculation from timestamps.

**Definition of Done:** incident record contains measured phase, affected versions, reproduction status, and owner/escalation target.

## Workflow 3 — Performance Regression CI Gate

**Trigger:** runtime/orchestration change touches tool dispatch, state persistence, context management, sandbox/broker, or tracing-sensitive code.

**Goal:** prevent continuation-latency regressions.

**Inputs:** stable benchmark fixture, baseline summary, current summary, policy.

**Stages:**
1. Run benchmark under unchanged security configuration.
2. Profile all cycles.
3. Fail on malformed/incomplete timing data.
4. Run regression gate.
5. Run correctness tests.
6. Store summaries as CI artifacts.

**Retry policy:** one retry only for known benchmark infrastructure failure; do not retry a valid performance failure until code changes.

**Stop conditions:** pass or fail deterministically.

**Failure path:** publish exact failed metric and baseline/current p95; do not auto-relax budget.

**Verification:** gate command exits 0 and functional tests pass.

**Definition of Done:** current result stays within absolute and relative thresholds with enough samples.