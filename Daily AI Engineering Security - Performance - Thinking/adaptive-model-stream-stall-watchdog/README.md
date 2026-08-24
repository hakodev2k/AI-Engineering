# Adaptive Model-Stream Stall Watchdog

**Category:** Performance

## Problem
Fixed inactivity deadlines can kill healthy long-context/high-effort requests, while missing watchdogs can hang autonomous workers indefinitely. Current public issues show both extremes in 2026.

## Evidence
See `evidence/research.md` for dated sources, existing approaches, limitations, root causes, and interpretation.

## Proposed improvement
Use phase-aware, model-aware latency evidence to recommend bounded TTFT and mid-stream watchdog budgets, preserve typed cancellation causes, and cap retries and retry token overhead.

## Architecture
- `evidence/research.md` — research and problem qualification.
- `config/policy.json` — conservative bounds and retry budget.
- `scripts/analyze_stalls.py` — deterministic trace analyzer.
- `tests/test_analyze_stalls.py` — analyzer regression tests.
- `skills/stall-diagnosis.md` — evidence-driven diagnosis procedure.
- `rules/watchdog-policy.md` — enforceable runtime requirements.
- `subagents/performance-investigator.md` — independent measurement role.
- `workflows/measure-tune-verify.md` — bounded optimization loop.
- `hooks/preflight.md` — deterministic pre-deploy gate.

## Installation
Requires Python 3.10+ and no third-party packages.

## Configuration
Adjust `config/policy.json` only after collecting representative healthy samples. Keep finite floors/ceilings and a bounded retry count.

## Usage
Produce JSONL events with `timestamp_ms`, `request_id`, `phase` (`ttft` or `stream`), `event` (`start`, `progress`, `completed`, `timeout`) and optional `bucket`. Run:
`python scripts/analyze_stalls.py trace.jsonl --policy config/policy.json --output watchdog-report.json`

## Workflow
Follow `workflows/measure-tune-verify.md`: Measure → Diagnose → Hypothesize → Optimize → Measure again → independently verify. Maximum two tuning iterations.

## Metrics
False timeout rate, silent stall duration p95, TTFT/inter-event quantiles, retry success, retry token overhead, completion rate, and worker-slot stall minutes.

## Verification
Implemented means the runtime consumes the policy. Measured means before/after traces exist. Verified means false kills or silent-stall duration improve without material completion regression or unbounded waits.

## Safety
Never classify human wait as model stall. Never remove the hard ceiling merely to improve completion. Preserve explicit cancellation provenance.

## Failure handling
Rollback on regression, retain traces, limit automatic retries to policy, and escalate correlated provider incidents rather than generating retry storms.

## Definition of Done
Research documented; baseline captured; limitations identified; analyzer/tests pass; policy implemented; before/after metrics collected; independent verification complete; no blocking regression remains.

## Customization
Add buckets for provider/model/effort/context-size regimes only when telemetry shows materially different latency distributions.
