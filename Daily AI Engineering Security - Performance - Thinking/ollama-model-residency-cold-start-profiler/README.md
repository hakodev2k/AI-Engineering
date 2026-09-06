# Ollama Model Residency Cold-Start Profiler

**Category:** Performance

## Problem
Intermittent local-agent workloads can repeatedly pay model load latency after idle gaps, while static keep-alive settings can waste VRAM or fail under runtime regressions/concurrency. This package turns residency into a measurable performance control.

## Evidence
See `evidence/research.md` for recent public signals including waired-agent #861, Ollama #16610 and #17004, plus 2026 cold/warm benchmark evidence.

## Existing approach
Ollama exposes global/per-request keep-alive, preloading, and runtime status. These are useful controls but do not determine the correct policy for a workload or prove that the runtime actually honors intended residency behavior.

## Existing limitations
Static keep-alive ignores idle-gap distribution and memory contention; runtime/version behavior can alter eviction semantics; throughput benchmarks often hide load-duration spikes.

## Proposed improvement
Measure request telemetry, classify cold/warm requests, quantify load-duration share and idle gaps, change one residency variable at a time, then verify before/after latency and memory impact.

## Architecture
- `evidence/research.md` — observed evidence, interpretation, root causes and opportunity.
- `skills/profile-residency.md` — reusable investigation procedure.
- `rules/performance-rules.md` — enforceable baseline/regression requirements.
- `subagents/performance-investigator.md` — bounded investigator role.
- `workflows/measure-optimize-verify.md` — measure/diagnose/optimize/verify workflow.
- `hooks/preflight.md` — deterministic measurement gate.
- `scripts/residency_profiler.py` — dependency-free JSONL profiler/comparator.
- `tests/test_residency_profiler.py` — runnable unit tests.

## Installation
Requires Python 3.9+ for the profiler/tests. No third-party Python packages are required.

## Configuration
Export runtime telemetry as JSONL. Required fields per line: `timestamp`, `model`, `total_duration_ms`, `load_duration_ms`. Optional fields such as VRAM, prompt-evaluation duration, concurrency and runtime version should be retained in the source evidence.

## Usage
`python scripts/residency_profiler.py baseline.jsonl --out baseline-report.json`

Compare a candidate trace:

`python scripts/residency_profiler.py baseline.jsonl --compare candidate.jsonl --out comparison.json`

Run tests:

`python -m unittest tests/test_residency_profiler.py`

## Workflow
Follow `workflows/measure-optimize-verify.md`: Observe → Measure baseline → Diagnose → Form one hypothesis → Implement one bounded change → Measure again → Compare → Independent verification.

## Metrics
Cold-start rate; p50/p95 total latency; p50/p95 load duration; load-duration share; idle-gap p50/p95; peak resident GPU/RAM memory recorded externally.

## Verification
**Implemented:** package files and deterministic profiler exist. **Measured:** a valid baseline and comparable candidate each contain at least 20 requests. **Verified:** candidate reduces residency-related latency/cold starts without exceeding the declared memory budget, and an independent reviewer accepts the evidence.

## Safety
The package is read-only by default. It does not alter Ollama configuration or kill processes. Configuration changes are applied manually by the operator and should be reversible.

## Failure handling
Malformed traces block with exit code 2; insufficient sample size blocks claims with exit code 3. Optimization is limited to three hypotheses. Preserve failed reports and escalate suspected runtime regressions with reproducible evidence.

## Definition of Done
Evidence documented; baseline captured; bottleneck classified; limitations identified; a bounded improvement tested when applicable; tests pass; before/after metrics collected; memory impact documented; independent verification complete; no blocking regression remains.

## Customization
Adjust workload collection and organizational memory budgets, but do not lower the minimum evidence threshold to make a candidate appear successful. Extend telemetry fields without changing the required schema.
