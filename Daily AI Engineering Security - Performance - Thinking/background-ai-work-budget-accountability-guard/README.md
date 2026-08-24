# Background AI Work Budget Accountability Guard

**Category:** Token

## Problem
Background memory, review, sync, and auxiliary-agent work can consume model requests and tokens while foreground sessions are idle or after useful progress has stopped. Current public reports show both runaway loops and telemetry gaps.

## Evidence
See `evidence/research.md` for current reports from OpenAI Codex, Hermes Agent, and Claude Code, plus the separation between observed evidence and package interpretation.

## Existing approach and limitation
Provider usage meters, parent-session totals, generic request logs, and manual cancellation exist, but they often lack per-background-job attribution, progress semantics, or hard job-level budgets.

## Proposed improvement
Normalize background events, bind every request to `job_id` + `parent_id`, measure token categories, detect repeated state/progress fingerprints, and enforce bounded job budgets before another model turn is dispatched.

## Architecture
```text
background-ai-work-budget-accountability-guard/
├── README.md
├── evidence/research.md
├── rules/background-budget-rules.md
├── skills/background-work-accounting.md
├── workflows/measure-diagnose-enforce-verify.md
├── scripts/background_budget_guard.py
└── tests/test_background_budget_guard.py
```

## Installation
Requires Python 3.9+ and no third-party packages. Copy this directory into the host engineering repository or runtime tooling tree.

## Configuration
The host must emit JSONL events with `timestamp`, `job_id`, `parent_id`, and `event`. `model_request` events should include `input_tokens`, `output_tokens`, `cached_input_tokens`, `state_fingerprint`, and `progress_fingerprint` when available.

## Usage
```bash
python scripts/background_budget_guard.py trace.jsonl \
  --max-requests 50 \
  --max-input-tokens 2000000 \
  --max-output-tokens 200000 \
  --max-no-progress 3
```
Use `--report-only` while establishing the baseline; remove it only after thresholds are evidence-based.

## Workflow
Follow `workflows/measure-diagnose-enforce-verify.md`: Observe → baseline → diagnose → hypothesis → implement one control → measure again → independent verification. Optimization retries are capped at 3.

## Metrics
Background tokens/task; requests/task; cached-input ratio; idle requests/hour; repeated-state turns; useful outputs/request; unattributed request percentage; quality regression rate.

## Verification
Run:
```bash
python -m unittest tests/test_background_budget_guard.py
```
A production integration is **Implemented** when identity propagation and budgets exist, **Measured** when comparable before/after traces exist, and **Verified** only when all requests are attributable, hard budgets/no-progress limits hold, tests pass, and task quality remains within the declared tolerance.

## Safety
The included script is read-only: it does not kill processes, alter accounts, change prompts, or contact model providers. Hosts may use its blocking exit code to prevent another background dispatch. Do not remove correctness-critical context to satisfy a token budget; pause/escalate instead.

## Failure handling
Invalid telemetry returns exit code 3; policy violations return 2; success returns 0. On violation, retain the trace, stop only the affected job through the host's normal lifecycle API, and do not increase budgets merely to hide the failure.

## Definition of Done
Current evidence documented; baseline captured; background requests attributable; limitations/root cause recorded; job budgets and progress gating implemented; deterministic tests pass; before/after metrics collected; useful-output/quality regression checked; no blocking violation remains; independent verification complete.

## Customization
Tune budgets per job class and workload. Replace simple fingerprints with runtime-native durable state hashes where available, but preserve stable identity, attribution, bounded retries, and progress-coupled dispatch.
