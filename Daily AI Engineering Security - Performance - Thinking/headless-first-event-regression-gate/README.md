# Headless First-Event Regression Gate

**Category:** Performance

## Problem
Headless AI CLI calls can stay functionally correct while gaining fixed startup/session-init delays. Outer job duration and success codes do not show whether time was lost before the first useful stream event, and timeout increases merely conceal the regression.

## Evidence
August 2026 Claude Code reports document a measured first-stream regression beginning around 2.1.198–2.1.200 and persisting in later releases, plus a separate reproducible ~405-second early-session stall that broke scheduled-run budgets. See `evidence/research.md` for observed evidence, interpretation and source links.

## Existing approach and limitation
Teams commonly pin versions, raise timeouts or watch total duration. Those controls lack milestone timing, robust repeated samples and an explicit release gate.

## Proposed improvement
Benchmark spawn-to-first-stdout and total duration with a fixed fixture, retain raw samples, compare robust median/p95 metrics against a known-good baseline, and block upgrades on measured regression.

## Architecture
- `scripts/measure_first_event.py` — dependency-free benchmark and baseline comparator with concurrent pipe draining.
- `config/thresholds.json` — starting performance policy.
- `skills/first-event-baselining.md` — measurement/diagnosis procedure.
- `rules/performance-regression-policy.md` — enforceable controls.
- `subagents/benchmark-reviewer.md` — independent verifier.
- `workflows/version-regression.md` — bounded measure/diagnose/remeasure flow.
- `hooks/pre-upgrade-benchmark.md` — release gate contract.
- `tests/test_measure_first_event.py` — deterministic tests including high-output deadlock protection.
- `evidence/research.md` — current public evidence.

## Installation
Requires Python 3.9+ and no runtime third-party packages. Copy this directory as a unit.

## Usage
```bash
python3 scripts/measure_first_event.py --repeat 7 --warmup 1 --stdin-file prompt.txt --output baseline.json -- <known-good-command> ...
python3 scripts/measure_first_event.py --repeat 7 --warmup 1 --stdin-file prompt.txt --baseline baseline.json --output candidate.json -- <candidate-command> ...
```

Exit 0 means measurement/pass; exit 2 means baseline regression/failure. The script invokes commands without a shell and continuously drains stdout/stderr so verbose programs cannot deadlock the benchmark harness.

## Configuration
Start with `config/thresholds.json`, but pass organization-approved ratios via CLI. Calibrate on representative stable data. Never loosen gates only to make an upgrade pass.

## Workflow
Follow `workflows/version-regression.md`: Observe → baseline → candidate measure → diagnose one hypothesis → mitigate → remeasure → independent verification. Diagnostic iterations are capped at two.

## Metrics
First-byte median/p95, total median/p95, failure rate, sample count and baseline/candidate ratios.

## Verification
Run `python3 -m pytest tests/test_measure_first_event.py` when pytest is available. A release is verified only when fixture equivalence is confirmed by the independent reviewer and the candidate meets thresholds with zero unaccepted timeout samples.

## Safety
Do not benchmark destructive commands. Use isolated test accounts/workspaces. Performance changes MUST NOT disable authentication, sandboxing, permissions or other security controls.

## Failure handling
Invalid environmental runs are retained and may be retried once after interference is resolved. A genuine regression receives at most two mitigation iterations before rollback/block/escalation.

## Definition of Done
- **Implemented:** benchmark, rules and release hook are integrated.
- **Measured:** baseline/candidate raw JSON exists with sufficient samples.
- **Verified:** independent review passes and thresholds pass, or a documented rollback/block prevents rollout.

## Customization
Provider-specific structured-event milestones may be added when parsing is deterministic; preserve first-byte timing as the product-agnostic baseline.
