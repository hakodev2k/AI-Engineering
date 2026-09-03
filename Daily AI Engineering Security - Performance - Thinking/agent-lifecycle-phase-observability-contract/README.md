# Agent Lifecycle Phase Observability Contract

**Category:** Performance

## Problem
Agent runs can expose end-to-end elapsed time without enough lifecycle phase data to determine whether latency came from model inference, approval wait, tool execution, host orchestration, or post-tool processing. Current Codex reports show both demand for richer timing events and concrete false diagnoses caused by mixed timing.

## Evidence
See `evidence/research.md`. Current signals include Codex #42494 (2026-09-03), #40087 (2026-08-22), and #38731 (2026-08-15).

## Existing approach and limitations
Completion-only hooks, console timestamps, tool-local timers and provider traces each cover only part of the run. They do not reliably provide host-neutral phase boundaries or prove that a component-level conclusion is attributable.

## Proposed improvement
Emit a normalized lifecycle event contract, validate correlation/order/completeness deterministically, and prohibit component-level performance conclusions from incomplete traces.

## Architecture
- `evidence/research.md` — current evidence, existing approaches, gap and root causes.
- `config/policy.json` — required events and verification thresholds.
- `scripts/lifecycle_profiler.py` — dependency-free JSONL validator/profiler.
- `tests/test_lifecycle_profiler.py` — deterministic valid/incomplete trace tests.
- `rules/timing-evidence.md` — observable timing invariants.
- `skills/lifecycle-latency-investigation.md` — evidence-driven investigation procedure.
- `subagents/performance-verifier.md` — independent verification role.
- `workflows/measure-diagnose-verify.md` — bounded baseline/optimization workflow.
- `hooks/post-run-evidence-gate.md` — completion gate for performance evidence.

## Package tree
```text
agent-lifecycle-phase-observability-contract/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/post-run-evidence-gate.md
├── rules/timing-evidence.md
├── scripts/lifecycle_profiler.py
├── skills/lifecycle-latency-investigation.md
├── subagents/performance-verifier.md
├── tests/test_lifecycle_profiler.py
└── workflows/measure-diagnose-verify.md
```

## Installation
Python 3.9+; no third-party packages are required.

## Configuration
Adjust `config/policy.json` only with documented workload rationale. Do not lower completeness requirements to make an incomplete trace pass.

## Usage
Export one JSON object per line containing `timestamp_ms`, `run_id`, `turn_id`, and `event`; tool events also require `tool_call_id`.

```bash
python scripts/lifecycle_profiler.py events.jsonl --policy config/policy.json --output report.json
python -m unittest tests/test_lifecycle_profiler.py
```

## Workflow
Follow `workflows/measure-diagnose-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Improve → Measure again → Independently verify.

## Metrics
Lifecycle completeness, invalid order, model TTFT/duration, approval wait, tool execution, end-to-end turn latency, residual host time, unsupported attribution count.

## Verification
**Implemented:** event contract, profiler, rules, workflow and tests exist.

**Measured:** a real run is measured only after its trace passes the profiler.

**Verified:** a performance improvement requires equivalent baseline/candidate workloads and the independent verifier's `verified` verdict.

## Safety
This package is read-only with respect to production systems. It MUST NOT justify weakening permissions, approval controls, sandboxing, verification or correctness for latency gains.

## Failure handling
Detection: profiler non-zero exit, missing correlation, invalid order, or threshold regression. Evidence: preserve raw trace and generated report. Retry: maximum two instrumentation repairs or two optimization hypotheses per phase. Fallback: classify as `insufficient_evidence`. Escalation: platform/human owner. Stop: no verified evidence after bounded retries or any security/correctness regression.

## Definition of Done
Evidence documented; required files present; baseline trace valid; bottleneck attributable; improvement measured; tests pass; risks recorded; no security boundary weakened; independent verification complete; no blocking issue remains.

## Customization
Hosts may add lifecycle events, but should keep stable correlation IDs and preserve the distinction between user wait, host wait, model time and actual tool execution.
