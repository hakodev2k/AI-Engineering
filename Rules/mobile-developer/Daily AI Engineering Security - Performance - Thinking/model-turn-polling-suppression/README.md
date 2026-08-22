# Model Turn Polling Suppression

**Category:** Performance

## Problem and evidence
Long-running agent workflows can spend model turns repeatedly checking unchanged child/process state. `evidence/research.md` records two recent independent Codex issue reports that quantify polling-only turns and token volume.

## Existing approach and limitation
Fixed wait/status polling is simple and preserves liveness, but a no-change timeout can still cause another full model turn. Longer intervals reduce frequency but may delay meaningful state unless the harness has an event/wakeup mechanism.

## Proposed improvement
Measure first, then gate model re-entry on meaningful state changes. Prefer event-driven wakeups; otherwise coalesce unchanged checks and use bounded adaptive backoff with a finite liveness checkpoint. Preserve immediate wakeups for completion, errors, approvals, user input, and new output.

## Architecture
The analysis Skill defines measurement and diagnosis; Rules establish observable constraints; the independent investigator verifies changes; the workflow bounds remediation; the analyzer classifies polling-only turns; the hook enforces regression thresholds.

## Package tree
```text
README.md
evidence/research.md
skills/polling-baseline-analysis.md
rules/orchestration-polling-rules.md
subagents/trace-performance-investigator.md
workflows/measure-coalesce-verify.md
hooks/post-run-polling-regression.md
scripts/polling_trace_analyzer.py
config/polling-budget.json
tests/test_polling_trace_analyzer.py
```

## Installation
Python 3.9+; no third-party packages. Integrate trace emission into the orchestrator with one JSON object per line. A model turn should include `kind=model_turn`, `action`, optional `state_changed`, and token fields when available.

## Configuration
Edit `config/polling-budget.json` for the workload. The included 20% ratios and three consecutive no-progress polls are example starting thresholds, not universal performance claims. Configure an explicit liveness/wakeup-delay requirement in the host benchmark.

## Usage
`python3 scripts/polling_trace_analyzer.py run.jsonl --config config/polling-budget.json`

Run tests with `python3 -m unittest tests/test_polling_trace_analyzer.py`.

## Workflow
Follow `workflows/measure-coalesce-verify.md`: Observe → baseline → diagnose → hypothesize → implement one change → measure again → independently verify. Maximum two remediation cycles.

## Metrics
Model turns/task, polling-only turns/task, polling-turn ratio, tokens/task, polling-token ratio, maximum consecutive no-progress polls, p95 task latency, wakeup delay, and task success/regression rate.

## Verification
A lower polling ratio alone is insufficient. Compare representative before/after workloads; require task success, required wakeups, configured latency bounds, analyzer PASS, and independent investigator PASS.

## Safety
Do not suppress errors, user input, approvals, completion, or new output. Do not trade security or verification for lower model usage. Use conservative bounded polling when event semantics are unreliable.

## Failure handling
Detection comes from analyzer/hook or task liveness checks. Preserve trace evidence. Retry at most twice with a different evidence-backed hypothesis. Roll back on correctness or liveness regression. Escalate missing scheduler/lifecycle capabilities rather than hiding failures with threshold changes.

## Implemented / Measured / Verified
**Implemented**: instrumentation/gating exists. **Measured**: representative before/after telemetry exists. **Verified**: efficiency improves and task correctness/liveness independently pass. These states MUST remain distinct.

## Definition of Done
Current evidence documented; baseline captured; cause identified; one improvement implemented; post-change metrics captured; polling overhead is within configured budget or measurably lower; task success is unchanged or better; mandatory wakeups pass; regression hook passes; independent verification passes; no blocking issue remains.

## Customization
Extend `POLL_KINDS` for host-specific tools, enrich traces with cached/uncached token fields, add per-agent attribution, or replace polling with native event subscriptions while preserving the same measurement and verification contract.