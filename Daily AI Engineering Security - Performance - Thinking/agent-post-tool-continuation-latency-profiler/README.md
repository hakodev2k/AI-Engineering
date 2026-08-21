# Agent Post-Tool Continuation Latency Profiler

## Topic
Diagnosing and preventing agent latency that occurs **after a tool has already finished** but before the agent continues with its next useful action.

## Category
**Performance**

## Problem
Agentic coding systems often report or appear to have “slow tools,” yet the underlying shell command, filesystem operation, MCP call, or test may already have completed quickly. The remaining delay can be introduced by result ingestion, broker/worker scheduling, sandbox bookkeeping, context hydration/compaction, state persistence, model re-entry, provider queueing, or UI/runtime continuation.

When teams measure only end-to-end task time or tool-handler duration, they can optimize the wrong component and see no improvement.

This package turns one opaque tool cycle into five timestamped boundaries and deterministic derived metrics.

## Evidence
Current public evidence is documented in [`evidence/research.md`](evidence/research.md). Key signals include:
- OpenAI Codex issue #34627 (2026-07-21), where one-line edits took 81–258 seconds despite fast local filesystem/Git/test controls;
- OpenAI Codex issue #24738 (2026-05-27), where tool/MCP results returned in roughly 0.23–0.6 seconds but the next agent action lagged by roughly 93–119 seconds;
- Codex issue #34971 describing severe long-session slowdown and repeated context/tool-loop overhead;
- OpenAI Agents SDK tracing, which provides turn/model/tool/custom spans and the timing primitives needed to build phase-level observability.

## Existing approach
Teams commonly rely on:
- whole-task duration;
- tool-handler duration;
- generic trace dashboards;
- ad-hoc timestamp subtraction from logs;
- speculative workarounds such as restarting the client, disabling integrations, shrinking repositories, or blaming local disk/network.

## Existing limitations
These approaches do not consistently answer the key question: **where did the wall time go?** A tool can complete in 500 ms while the user waits 90 seconds. Generic traces may expose raw spans without calculating the specific continuation gap or enforcing a regression budget. Manual inspection also does not scale across many runs.

## Proposed improvement
Use a stable phase contract:

```text
agent action
  -> tool_start
  -> tool_end
  -> result_ingested
  -> next_model_start
  -> next_agent_action
```

Then derive:

```text
tool runtime         = tool_end - tool_start
result ingestion     = result_ingested - tool_end
continuation gap     = next_model_start - tool_end
model continuation   = next_agent_action - next_model_start
tool cycle           = next_agent_action - tool_start
```

This package profiles those phases, groups them by tool, computes percentiles, flags incomplete traces, calculates continuation/tool dominance, and gates changes against absolute and baseline-relative thresholds.

## Architecture

### Trace boundary
The host emits normalized JSONL events. Raw tool output is not required.

### Profiler
[`scripts/trace_latency_profiler.py`](scripts/trace_latency_profiler.py) validates event ordering, rejects missing/duplicate phases, derives per-cycle metrics, and calculates p50/p95/p99 summaries.

### Policy
[`config/latency-policy.json`](config/latency-policy.json) defines phase budgets, regression tolerance, minimum samples, slow-cycle threshold, and safety constraints.

### Regression gate
[`scripts/latency_regression_gate.py`](scripts/latency_regression_gate.py) compares current p95 values against absolute budgets and an optional baseline, then reports failed metrics and continuation-dominant cycles.

### Investigation workflow
[`workflows/workflows.md`](workflows/workflows.md) enforces:

**Measure → Diagnose → Hypothesize → Experiment → Implement → Measure again → Gate → Verify**

Diagnosis and optimization loops are bounded.

## Package structure

```text
agent-post-tool-continuation-latency-profiler/
├── README.md
├── guide-intergration.md
├── config/
│   └── latency-policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── sample-events.jsonl
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── latency_regression_gate.py
│   └── trace_latency_profiler.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_latency_profiler.py
├── verification/
│   └── report.md
└── workflows/
    └── workflows.md
```

## Installation
Requires Python 3.10+ and only the standard library.

Copy this package into the runtime/harness repository. No secret or provider key is required by the deterministic scripts.

## Configuration
Start with [`config/latency-policy.json`](config/latency-policy.json). The default policy includes:
- minimum 5 cycles for a regression decision;
- p95 budgets for tool runtime, ingestion, continuation, model continuation, and total tool cycle;
- max relative increase of 20%;
- max absolute increase of 2000 ms;
- continuation dominance ratio of 3x;
- no destructive probes;
- no disabling security controls for benchmark speed.

The numerical defaults are starting thresholds, not universal SLAs. Replace them only after measuring a healthy representative baseline.

## Usage

### 1. Emit normalized events
Follow [`guide-intergration.md`](guide-intergration.md) and [`hooks/hooks.md`](hooks/hooks.md).

Each event contains:

```json
{
  "run_id": "run-123",
  "cycle_id": "cycle-7",
  "tool": "exec_command",
  "phase": "tool_end",
  "ts": "2026-08-20T12:00:00.500+07:00"
}
```

### 2. Create a baseline

```bash
python scripts/trace_latency_profiler.py events-baseline.jsonl \
  --output baseline-summary.json
```

Do not proceed if the profiler returns incomplete or non-monotonic cycles.

### 3. Diagnose the dominant phase
Inspect:
- `tool_runtime_ms`;
- `result_ingestion_ms`;
- `continuation_gap_ms`;
- `model_continuation_ms`;
- `tool_cycle_ms`;
- `continuation_tool_ratio`.

A high continuation/tool ratio is a localization signal, not proof of a specific root cause.

### 4. Re-measure after a fix

```bash
python scripts/trace_latency_profiler.py events-current.jsonl \
  --output current-summary.json
```

### 5. Run the gate

```bash
python scripts/latency_regression_gate.py \
  --current current-summary.json \
  --baseline baseline-summary.json \
  --policy config/latency-policy.json \
  --output regression-report.json
```

Exit codes:
- `0` — pass;
- `2` — incomplete data, budget violation, or regression;
- `3` — invalid input/config.

## Workflow
Primary workflow:

1. Instrument the five phases.
2. Capture a representative baseline.
3. Identify the dominant measured phase.
4. Form at most three hypotheses.
5. Run discriminating experiments one variable at a time.
6. Implement only in the evidence-backed owning layer.
7. Re-run the exact workload.
8. Gate against baseline and budgets.
9. Independently verify high-impact changes.
10. Stop after two failed optimization attempts and return to diagnosis/escalation.

## Metrics
Track at minimum:
- p50/p95/p99 tool runtime;
- p50/p95/p99 result-ingestion delay;
- p50/p95/p99 continuation gap;
- p50/p95/p99 model-continuation delay;
- total tool-cycle latency;
- continuation/tool ratio;
- incomplete-trace rate;
- timeout/error rate;
- tool/model-call count where available;
- throughput for repeated workloads.

Never claim improvement without comparable before/after evidence.

## Verification
See [`verification/report.md`](verification/report.md).

Run the included self-test:

```bash
python -m unittest tests/test_latency_profiler.py
python scripts/trace_latency_profiler.py examples/sample-events.jsonl \
  --output sample-summary.json
```

A target runtime is **Verified** only after enough representative cycles are measured, both profiler and regression gate pass, and correctness/security tests remain green.

## Implemented / Measured / Verified
- **Implemented:** phase contract, profiler, policy, regression gate, workflows, tests, hooks.
- **Measured:** the package can derive exact timing metrics from supplied traces; the bundled sample is illustrative only.
- **Verified:** reserved for an integrated runtime whose real benchmark passes the gate and independent correctness/security verification.

The package itself does not claim that any external agent runtime has been made faster.

## Safety
- Performance tests must keep sandboxing, permissions, approvals, and validation equivalent to baseline.
- Destructive probes are forbidden by default.
- Raw sensitive tool outputs are unnecessary for the timing schema and should be omitted/redacted.
- A performance failure must not be hidden by loosening correctness or security criteria.
- External/provider-owned bottlenecks should be escalated with trace IDs/timestamps rather than worked around by unsafe behavior.

## Failure handling
### Missing instrumentation
Detection: profiler reports missing phase or non-monotonic timestamps.

Fallback: add the missing host/custom-span boundary. Do not infer zero latency.

Stop condition: no performance conclusion until timing integrity is restored.

### Hypothesis fails
Evidence: target phase does not improve or another phase becomes dominant.

Retry policy: up to three diagnosis experiments and two implementation attempts.

Fallback: revert/retain known-good state and reassess ownership.

Escalation: provider/runtime owner when the dominant phase is external.

### Regression gate fails
Preserve current/baseline summaries, report exact metric, and reject the performance claim. Do not auto-change thresholds.

## Definition of Done
A performance improvement is complete only when:
- evidence/research and current limitation are documented;
- baseline contains at least the configured minimum complete cycles;
- dominant phase is identified from measurements;
- improvement targets that measured phase;
- current benchmark is workload/environment comparable;
- profiler reports no blocking timing-integrity problem;
- regression gate exits 0;
- targeted phase is improved or within policy;
- no material adjacent-phase regression remains;
- correctness/security tests pass;
- high-impact changes receive independent verification;
- retry limits and approvals are resolved;
- final report distinguishes Implemented, Measured, and Verified.

## Customization
You can extend the normalized event model with:
- model/provider request IDs;
- context-token bucket;
- compaction/reconnect state;
- queue or sandbox-init timestamps;
- state-persistence boundaries;
- UI-render timestamps;
- service region;
- runtime build SHA.

Add new phases only when they improve attribution and remain deterministic. Keep the core invariant: **measure the phase before optimizing the layer**.