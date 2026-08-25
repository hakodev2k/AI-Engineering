# Desktop Agent Resource Contention Profiler

**Category:** Performance

## Problem
Desktop/CLI AI coding agents can coincide with severe host-level input lag, extreme disk reads, or event-loop/main-process stalls. Existing troubleshooting often mixes model/network latency with local resource contention.

## Evidence
See `evidence/research.md` for current August 2026 signals, including Codex Windows input-latency and disk-I/O reports plus a Claude Code input/event-loop report.

## Existing approach
Task Manager/WPR/vendor logs and restarts are common.

## Existing limitations
They are rarely correlated to agent active/idle state or enforced as a regression gate; restarts may erase useful evidence.

## Proposed improvement
Collect a portable CSV trace, compute p50/p95/p99 resource/input metrics, compare active versus idle state, and fail deterministic thresholds. Correlation is diagnostic, not causal proof.

## Architecture / package tree
- `README.md`
- `evidence/research.md`
- `config/thresholds.json`
- `scripts/profile_contention.py`
- `tests/test_profile_contention.py`
- `skills/measure-host-contention.md`
- `rules/performance-rules.md`
- `subagents/performance-investigator.md`
- `workflows/diagnose-and-verify.md`
- `hooks/regression-check.md`

## Installation
Python 3.9+; no third-party packages.

## Configuration
Tune `config/thresholds.json` to representative hardware/workloads. Threshold changes require review and MUST NOT simply loosen a failing gate.

## Usage
`python scripts/profile_contention.py trace.csv --thresholds config/thresholds.json --output report.json`

CSV columns: `timestamp_ms,state,input_latency_ms,cpu_pct,read_mb_s,write_mb_s,rss_mb,event_loop_lag_ms`. State is `idle` or `active`.

Exit codes: `0` pass, `1` invalid input/runtime error, `2` threshold regression.

## Workflow
Follow `workflows/diagnose-and-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Change one factor → Measure again → independently verify. Maximum three hypotheses.

## Metrics
Input latency p50/p95/p99; CPU/read/write/RSS/event-loop lag p95; active/idle latency ratio; threshold findings.

## Verification
Run `python -m unittest discover -s tests -p 'test_*.py'`. A production claim additionally requires three comparable before/after workload runs and independent review.

## Safety
Read-only analysis. Never disable sandboxing, endpoint protection, or permission controls to improve measurements.

## Failure handling
Invalid traces block completion. Non-reproducible symptoms remain unresolved. Three failed hypotheses trigger escalation with preserved evidence.

## Definition of Done
- **Implemented:** analyzer, rules, workflow, tests, and hook are present.
- **Measured:** baseline and post-change reports exist for the same workload.
- **Verified:** tests pass; thresholds improve across three runs; an independent verifier confirms no security regression.

## Customization
Platform-specific collectors may emit the documented CSV columns while retaining the same analyzer contract.
