# Wait/Status Inference Circuit Breaker

**Category:** Performance

## Problem
Agent orchestrators can burn tokens and latency while idle because every wait/status timeout re-enters the model even when observable target state did not change.

## Evidence
See `evidence/research.md`. Recent public Codex reports measured wait-family calls dominating tool activity, repeated timeouts, stale/noop waits, and large cached-context remetering.

## Existing approach
Fixed polling, cached inference, lifecycle APIs, and manual stop/restart.

## Existing limitations
Polling still creates model turns; cache hits do not eliminate metered usage; stale target state can keep loops alive; manual recovery does not scale to unattended runs.

## Proposed improvement
Move waiting out of model reasoning whenever possible. Fingerprint observations, suppress unchanged timeouts, back off after three identical no-progress observations, and circuit-break coordination-only model turns after five while preserving confirmed-running work.

## Architecture
- `skills/wait-loop-profiling.md`: baseline and diagnosis procedure.
- `rules/coordination-budget-rules.md`: enforceable loop and measurement constraints.
- `subagents/performance-verifier.md`: independent verification.
- `workflows/measure-break-verify.md`: bounded optimization workflow.
- `hooks/pre-wait-circuit-check.md`: runtime gate.
- `scripts/wait_loop_analyzer.py`: deterministic trace analyzer.

## Package tree
```text
README.md
evidence/research.md
skills/wait-loop-profiling.md
rules/coordination-budget-rules.md
subagents/performance-verifier.md
workflows/measure-break-verify.md
hooks/pre-wait-circuit-check.md
scripts/wait_loop_analyzer.py
```

## Installation
Python 3.9+ is sufficient for the analyzer. Integrate the pre-wait hook at the orchestration layer before timeout/no-op observations are promoted into another model turn.

## Usage
`python3 scripts/wait_loop_analyzer.py trace.jsonl --breaker 5`

Exit 0 means no breaker candidate, 2 means invalid input/configuration, and 3 means repeated no-progress signatures were detected.

## Workflow
Observe → measure baseline → diagnose repeated signatures → select one optimization hypothesis → implement → measure again → independently verify. Maximum two optimization cycles.

## Metrics
Coordination-only turns/task, wait-input-token share, timeout ratio, longest identical no-progress run, useful completion latency, state-change reaction latency, false breaker activations.

## Verification
Run at least three equivalent baseline and candidate executions per fixture. Verify fewer coordination-only model turns/tokens, no missed state transitions, no terminated confirmed-running work, and non-regressive useful completion latency within configured tolerance.

## Safety
This guard blocks redundant inference, not active external work. Human approval and explicit user input always take priority. Never conceal a failure by simply extending timeout values.

## Failure handling
Detection: repeated normalized signatures or stale targets. Retry: maximum two changed remediation attempts. Fallback: event/deadline wait without model re-entry. Escalation: emit exact target/signature evidence. Stop when a real state change is missed or no measurable improvement is achieved.

## Implemented / Measured / Verified
Implemented means the guard is integrated. Measured means before/after metrics exist. Verified requires equivalent workload evidence and independent PASS. These states must remain distinct.

## Definition of Done
Evidence documented; baseline captured; repeated cause identified; guard implemented; before/after metrics show lower coordination-only calls/tokens; target work remains correct; state-change responsiveness passes; independent verifier returns PASS; no blocking issue remains.

## Customization
Adjust thresholds by workload, but keep finite bounds. Prefer runtime events over polling when supported, and retain provider/tool-specific telemetry for accurate token/cost accounting.